import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnChanges,
  Output
} from '@angular/core';
import * as d3 from 'd3';
import {Simulation, SimulationLinkDatum, SimulationNodeDatum} from 'd3-force';
import {GraphData} from './graph-data.model';
import {PropertyHandler} from '../../util/property-handler';
import {GraphSearchService} from './graph-search.service';
import {TipData} from "./user-tip/user-tip.component";

@Component({
  moduleId: module.id,
  selector: 'jg-graph',
  templateUrl: 'graph.component.html',
  styleUrls: ['graph.component.css']
})
export class GraphComponent implements AfterViewInit, OnChanges {

  @PropertyHandler({
    afterChange(data: GraphData) {
      if (!data) {
        this.data = {nodes: [], links: []};
        this._simulationState.paused = false;
      }
      this.searchService.reset();
      this.searchService.setData(this.data);
    }
  })
  @Input()
  data: GraphData;

  @Input()
  loading: boolean;

  @Output()
  onUserClick: EventEmitter<any> = new EventEmitter<any>();

  _tipData: TipData = {};

  _simulationState: {
    nodeDrag?: boolean,   // is node being dragged by user, responsible for hiding user tip.
    paused?: boolean      // is simulation paused
  } = {};

  private simulation: Simulation<SimulationNodeDatum, SimulationLinkDatum<SimulationNodeDatum>>;
  private canvas: HTMLCanvasElement;
  private properties: {
    pixelRatio?: number,
    width?: number
    height?: number
  } = {};

  private transform = d3.zoomIdentity;

  constructor(private zone: NgZone,
              private changeDetectorRef: ChangeDetectorRef,
              @Inject('GraphSearchService') private searchService: GraphSearchService) {
  }

  ngAfterViewInit(): void {
    this.canvas = <HTMLCanvasElement>document.getElementById('jgauss-graph');
    this.resize();
    this.restart();
  }

  ngOnChanges(): void {
    this.restart();
  }

  restart(): void {
    if (!this.data || !this.canvas || this._simulationState.paused) {
      return;
    }

    let self = this;

    this.zone.runOutsideAngular(() => {
        let d3canvas = d3.select('#jgauss-graph');
        let canvas = this.canvas;
        let context = canvas.getContext('2d');
        const radius = 5;

        if (!this.simulation) {
          this.simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(function (d: any) {
              return d.uid;
            }))
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(this.properties.width / 2, this.properties.height / 2));
        }
        let simulation = this.simulation;

        let render = () => {
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
          context.strokeStyle = '#aaa';
          context.stroke();

          context.beginPath();
          for (let node of this.data.nodes) {
            context.moveTo((node.x + radius) * scale + translate.x, node.y * scale + translate.y);
            context.arc(
              node.x * scale + translate.x,
              node.y * scale + translate.y,
              radius * scale,
              0, 2 * Math.PI);
          }

          context.fillStyle = '#206caf';
          context.strokeStyle = '#fff';
          context.fill();
          context.stroke();
        };

        d3canvas
          .call(d3.drag().subject(eventSubject)
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
          )
          .call(d3.zoom().scaleExtent([.3, 8]).on("zoom", zoomed))
          .call(render)
          .on('mousemove', () => {
            if (this._simulationState.nodeDrag) {
              this._tipData = {};
              this.changeDetectorRef.detectChanges();
              return;
            }
            let subject = eventSubject();
            if (this._tipData.user != subject) {
              this._tipData = {
                user: subject,
                event: d3.event
              };
              this.changeDetectorRef.detectChanges();
            }
          })
          .on('click', () => {
            let subject = eventSubject();
            if (subject) {
              d3.event.preventDefault();
              this.zone.run(() => {
                this._tipData = {};
                this.onUserClick.emit(subject);
              });
            }
          })
          .on('mouseout', () => {
            this._tipData = {};
            this.changeDetectorRef.detectChanges();
          });

        function zoomed() {
          self.transform = d3.event.transform;
          render();
        }

        function eventSubject() {
          let x = self.transform.invertX(d3.event.offsetX || d3.event.x) * self.properties.pixelRatio;
          let y = self.transform.invertY(d3.event.offsetY || d3.event.y) * self.properties.pixelRatio;

          for (let node of self.data.nodes) {
            if ((x - node.x) ** 2 + (y - node.y) ** 2 <= (radius + 1) ** 2) {
              return node;
            }
          }
        }

        function dragstarted() {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d3.event.subject.fx = d3.event.subject.x;
          d3.event.subject.fy = d3.event.subject.y;
          self._simulationState.nodeDrag = true;
          self._tipData = {};
          self.changeDetectorRef.detectChanges();
        }

        function dragged() {
          d3.event.subject.fx += d3.event.dx * self.properties.pixelRatio / self.transform.k;
          d3.event.subject.fy += d3.event.dy * self.properties.pixelRatio / self.transform.k;
        }

        function dragended() {
          if (!d3.event.active) simulation.alphaTarget(0);
          d3.event.subject.fx = null;
          d3.event.subject.fy = null;
          self._simulationState.nodeDrag = false;
        }

        simulation
          .nodes(this.data.nodes)
          .on('tick', render);

        simulation
          .force<any>('link')
          .links(this.data.links);

        simulation.alphaTarget(0.3).restart();
      }
    );
  }

  _pause(isPaused: boolean) {
    this._simulationState.paused = isPaused;
    this.zone.runOutsideAngular(() => {
      if (isPaused) {
        this.simulation.stop();
      } else {
        this.restart();
      }
    });
  }

  _search(searchQuery: string) {
    let color = this.searchService.search(searchQuery).getColorFunction();
    this.repaint(color);
  }

  _sort(sortType?: string, data?: any): void {
    let color = this.searchService.sort(sortType, data).getColorFunction();
    this.repaint(color);
  }

  private repaint(color: (data: any) => string): void {
  }

  @HostListener('window: resize')
  resize(): void {
    let {width, height} = this.canvas.getBoundingClientRect();

    let pixelRatio = this.properties.pixelRatio = window.devicePixelRatio || 1;

    this.canvas.width = this.properties.width = width * pixelRatio;
    this.canvas.height = this.properties.height = height * pixelRatio;

    this.canvas.style.height = height + 'px';

    console.log(width, height, this.properties);

    this.restart();
  }
}
