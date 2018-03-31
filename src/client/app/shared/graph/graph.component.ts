import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  NgZone,
  Output
} from '@angular/core';
import * as d3 from 'd3';
import {Simulation, SimulationLinkDatum, SimulationNodeDatum} from 'd3-force';
import {GraphData} from './graph-data.model';
import {PropertyHandler} from '../../util/property-handler';
import {GraphSearchService} from './graph-search.service';
import {TipData} from './user-tip/user-tip.component';
import {COLORS} from '../../vk/search-result/graph-search/vk-graph-search.service';

@Component({
  moduleId: module.id,
  selector: 'jg-graph',
  templateUrl: 'graph.component.html',
  styleUrls: ['graph.component.css'],
  host: {'[class._full-screen]': '_graphState.fullScreen'}
})
export class GraphComponent implements AfterViewInit {

  @PropertyHandler({
    afterChange(data: GraphData) {
      if (!data) {
        this.data = {nodes: [], links: []};
        this._graphState.paused = false;
      } else if (this.canvas) {
        this.updateSimulationData();
        this.repaint();
      }
      this.searchService.reset();
      this.searchService.setData(this.data);
    }
  })
  @Input()
  data: GraphData = {nodes: [], links: []};

  @Input()
  loading: boolean;

  @Output()
  onUserClick: EventEmitter<any> = new EventEmitter<any>();

  _tipData: TipData = {};

  _graphState: {
    nodeDrag?: boolean,   // is node being dragged by user, responsible for hiding user tip
    paused?: boolean,     // is simulation paused
    fullScreen?: boolean,
    resizeRequired?: boolean
  } = {};

  private simulation: Simulation<SimulationNodeDatum, SimulationLinkDatum<SimulationNodeDatum>>;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private transform = d3.zoomIdentity;
  private colorGroups: any;

  private properties: {
    pixelRatio?: number,
    width?: number
    height?: number,
    radius: number
  } = {radius: 5};

  constructor(private zone: NgZone,
              private changeDetectorRef: ChangeDetectorRef,
              @Inject('GraphSearchService') private searchService: GraphSearchService) {
  }

  ngAfterViewInit(): void {
    this.canvas = <HTMLCanvasElement>document.getElementById('jgauss-graph');
    this.resize();
    this.updateSimulationData();
    this.repaint();
    this.addEventListeners();
  }

  ngAfterViewChecked(): void {
    if (this._graphState.resizeRequired) {
      this.resize();
      this._graphState.resizeRequired = false;
    }
  }

  private redraw(force: boolean = false): void {
    if (!this.data || !this.canvas) {
      return;
    }

    if (this._graphState.paused && !force) {
      return;
    }

    if (!this.context) {
      this.context = this.canvas.getContext('2d');
    }

    let context = this.context;
    const radius = this.properties.radius;

    context.clearRect(-5, -5, this.properties.width + 10, this.properties.height + 10);

    let transform = this.transform;
    let pixelRatio = this.properties.pixelRatio;
    let translate = {
      x: transform.x * pixelRatio,
      y: transform.y * pixelRatio
    };
    let scale = transform.k;

    context.beginPath();
    for (let link of this.data.links) {
      context.moveTo(link.source.x * scale + translate.x, link.source.y * scale + translate.y);
      context.lineTo(link.target.x * scale + translate.x, link.target.y * scale + translate.y);

    }
    context.strokeStyle = COLORS.darkGrey;
    context.stroke();
    context.closePath();

    for (let color in this.colorGroups) {
      context.beginPath();
      for (let node of this.colorGroups[color]) {
        context.moveTo((node.x + radius) * scale + translate.x, node.y * scale + translate.y);
        context.arc(
          node.x * scale + translate.x,
          node.y * scale + translate.y,
          radius * scale,
          0, 2 * Math.PI);
      }

      context.fillStyle = color;
      context.strokeStyle = COLORS.white;
      context.fill();
      context.stroke();
      context.closePath();
    }
  }

  private updateSimulationData(): void {
    if (!this.data) {
      return;
    }

    this.zone.runOutsideAngular(() => {

        let redraw = this.redraw.bind(this);

        if (!this.simulation) {
          this.simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(function (d: any) {
              return d.id;
            }))
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(this.properties.width / 2, this.properties.height / 2));
        }
        let simulation = this.simulation;

        console.log(this.data);

        simulation
          .nodes(this.data.nodes)
          .on('tick', redraw);

        simulation
          .force<any>('link')
          .links(this.data.links);

        if (!this._graphState.paused) {
          simulation.alphaTarget(0.3).restart();
        }
      }
    );
  }

  private addEventListeners(): void {
    let self = this;
    let d3canvas = d3.select('#jgauss-graph');
    let redraw = this.redraw.bind(this);
    const radius = this.properties.radius;

    this.zone.runOutsideAngular(() => {
        d3canvas
          .call(d3.drag().subject(getEventSubject)
            .on('start', onDragStart)
            .on('drag', onDrag)
            .on('end', onDragEnd)
          )
          .call(d3.zoom().scaleExtent([.3, 8]).on('zoom', onZoom))
          .call(redraw)
          .on('mousemove', onMouseMove)
          .on('click', onClick)
          .on('mouseout', onMouseOut);

        function getEventSubject() {
          let x = self.transform.invertX(d3.event.offsetX || d3.event.x) * self.properties.pixelRatio;
          let y = self.transform.invertY(d3.event.offsetY || d3.event.y) * self.properties.pixelRatio;

          for (let node of self.data.nodes) {
            if ((x - node.x) ** 2 + (y - node.y) ** 2 <= (radius) ** 2) {
              return node;
            }
          }
        }

        function onZoom() {
          self.transform = d3.event.transform;
          redraw(true);
        }

        function onDragStart() {
          if (self._graphState.paused) {
            return;
          }
          if (!d3.event.active) {
            self.simulation.alphaTarget(0.3).restart();
          }
          d3.event.subject.fx = d3.event.subject.x;
          d3.event.subject.fy = d3.event.subject.y;
          self._graphState.nodeDrag = true;
          self._tipData = {};
          self.changeDetectorRef.detectChanges();
        }

        function onDrag() {
          d3.event.subject.fx += d3.event.dx * self.properties.pixelRatio / self.transform.k;
          d3.event.subject.fy += d3.event.dy * self.properties.pixelRatio / self.transform.k;
        }

        function onDragEnd() {
          if (!d3.event.active) {
            self.simulation.alphaTarget(0);
          }
          d3.event.subject.fx = null;
          d3.event.subject.fy = null;
          self._graphState.nodeDrag = false;
        }

        function onMouseMove() {
          if (self._graphState.nodeDrag) {
            self._tipData = {};
            self.changeDetectorRef.detectChanges();
            return;
          }
          let subject = getEventSubject();
          if (self._tipData.user != subject) {
            self._tipData = {
              user: subject,
              event: d3.event
            };
            self.changeDetectorRef.detectChanges();
          }
        }

        function onClick() {
          let subject = getEventSubject();
          if (subject) {
            d3.event.preventDefault();
            self.zone.run(() => {
              self._tipData = {};
              self.onUserClick.emit(subject);
            });
          }

        }

        function onMouseOut() {
          self._tipData = {};
          self.changeDetectorRef.detectChanges();
        }
      }
    );
  }

  _pause(isPaused: boolean) {
    this._graphState.paused = isPaused;
    this.zone.runOutsideAngular(() => {
      if (isPaused) {
        this.simulation.stop();
      } else {
        this.simulation.alphaTarget(0.3).restart();
      }
    });
  }

  _search(searchQuery: string) {
    this.searchService.search(searchQuery);
    this.repaint();
  }

  _sort(sortType ?: string, data ?: any): void {
    this.searchService.sort(sortType, data);
    this.repaint();
  }

  repaint(color: (data: any) => string = this.searchService.getColorFunction()): void {
    if (!this.data) {
      return;
    }

    this.colorGroups = {};
    this.data.nodes.forEach((node: any) => {
      let nodeColor = color(node);
      if (!this.colorGroups[nodeColor]) {
        this.colorGroups[nodeColor] = [node];
      } else {
        this.colorGroups[nodeColor].push(node);
      }
    });
    this.redraw(true);
  }

  @HostListener('window:resize')
  resize(): void {
    let {width} = this.canvas.getBoundingClientRect();

    let pixelRatio = this.properties.pixelRatio = window.devicePixelRatio || 1;

    let clientHeight = document.documentElement.clientHeight;
    let height = this._graphState.fullScreen ? clientHeight : Math.round(clientHeight * 0.9);

    this.canvas.width = this.properties.width = width * pixelRatio;
    this.canvas.height = this.properties.height = height * pixelRatio;

    this.canvas.style.height = height + 'px';

    this.redraw(true);
  }

  _toggleSizeMode(): void {
    this._graphState.fullScreen = !this._graphState.fullScreen;
    this._graphState.resizeRequired = true;
  }
}
