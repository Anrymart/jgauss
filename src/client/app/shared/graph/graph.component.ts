import {
  AfterViewInit,
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

  _tipData: any;
  _tipVisible: boolean;

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

          // context.translate(this.transform.x * this.properties.pixelRatio, this.transform.y * this.properties.pixelRatio);
          // context.scale(this.transform.k, this.transform.k);

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
          .call(d3.drag().subject(dragsubject)
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
          )
          .call(d3.zoom().scaleExtent([.3, 8]).on("zoom", zoomed))
          .call(render);

        function zoomed() {
          self.transform = d3.event.transform;
          render();
        }

        function dragsubject() {
          let i,
            x = self.transform.invertX(d3.event.x) * self.properties.pixelRatio,
            y = self.transform.invertY(d3.event.y) * self.properties.pixelRatio,
            dx, dy;

          for (let node of self.data.nodes) {
            dx = x - node.x;
            dy = y - node.y;
            if (dx * dx + dy * dy < radius * radius) {
              // node.x = transform.applyX(node.x);
              // node.y = transform.applyY(node.y);
              return node;
            }
          }
        }

        function dragstarted() {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d3.event.subject.fx = d3.event.subject.x;
          d3.event.subject.fy = d3.event.subject.y;
        }

        function dragged() {
          d3.event.subject.fx += d3.event.dx * self.properties.pixelRatio / self.transform.k;
          d3.event.subject.fy += d3.event.dy * self.properties.pixelRatio / self.transform.k;
        }

        function dragended() {
          if (!d3.event.active) simulation.alphaTarget(0);
          d3.event.subject.fx = null;
          d3.event.subject.fy = null;
        }

        simulation
          .nodes(this.data.nodes)
          .on('tick', render);

        simulation
          .force<any>('link')
          .links(this.data.links);

        simulation.alphaTarget(0.3).restart();

        // .on('click', (data: any) => {
        //   d3.event.preventDefault();
        //   this.zone.run(() => {
        //     this._tipVisible = false;
        //     this.onUserClick.emit(data);
        //   });
        // })
        // .on('mouseover', (data: any) => {
        //   if (!this._simulationState.nodeDrag) {
        //     data.event = d3.event;
        //     this._tipData = data;
        //     this._tipVisible = true;
        //     this.changeDetectorRef.detectChanges();
        //   }
        // })
        // .on('mouseout', (data: any) => {
        //   this._tipVisible = false;
        //   this.changeDetectorRef.detectChanges();
        // });

        //   let dragstarted = (d: any) => {
        //     if (this._simulationState.paused) {
        //       return;
        //     }
        //     if (!d3.event.active) {
        //       simulation.alphaTarget(0.3).restart();
        //     }
        //     d.fx = d.x;
        //     d.fy = d.y;
        //
        //     this._simulationState.nodeDrag = true;
        //   };
        //
        //   let dragged = (d: any) => {
        //     d.fx = d3.event.x;
        //     d.fy = d3.event.y;
        //   };
        //
        //   let dragended = (d: any) => {
        //     if (!d3.event.active) {
        //       simulation.alphaTarget(0);
        //     }
        //     d.fx = null;
        //     d.fy = null;
        //
        //     this._simulationState.nodeDrag = false;
        //   };
        //
        //   node.call(d3.drag()
        //     .on('start', dragstarted)
        //     .on('drag', dragged)
        //     .on('end', dragended));
        //
        // simulation.alphaTarget(0.3).restart();
        //
        //   d3.select(canvas)
        //     .call(d3.drag()
        //       .subject(dragsubject)
        //       .on('start', dragstarted)
        //       .on('drag', dragged)
        //       .on('end', dragended));
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
