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
import {BaseType, Selection} from 'd3-selection';
import {GraphData} from './graph-data.model';
import {PropertyHandler} from '../../util/property-handler';
import {GraphSearchService} from "./graph-search.service";

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
    paused?: boolean // is simulation paused
  } = {};

  private simulation: Simulation<SimulationNodeDatum, SimulationLinkDatum<SimulationNodeDatum>>;

  private groups: {
    container: Selection<BaseType, {}, BaseType, any>,
    node: Selection<BaseType, {}, BaseType, any>,
    link: Selection<BaseType, {}, BaseType, any>
  } = {node: null, link: null, container: null};

  constructor(private zone: NgZone,
              private changeDetectorRef: ChangeDetectorRef,
              @Inject('GraphSearchService') private searchService: GraphSearchService) {
  }

  ngAfterViewInit(): void {
    this.restart();
  }

  ngOnChanges(): void {
    this.restart();
  }

  restart(): void {
    if (!this.data || this._simulationState.paused) {
      return;
    }

    this.zone.runOutsideAngular(() => {
        let d3canvas = d3.select('#jgauss-graph');
        let canvas = <HTMLCanvasElement>d3canvas.node();
        let context = canvas.getContext("2d");
        let {width, height} = (<Element>canvas).getBoundingClientRect();
        const radius = 5;

        if (!this.simulation) {
          this.simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(function (d: any) {
              return d.uid;
            }))
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(width / 2, height / 2));
        }
        let simulation = this.simulation;

        d3canvas
          .call(d3.drag()
            .subject(dragsubject)
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        let ticked = () => {
          context.clearRect(0, 0, width, height);

          context.beginPath();
          this.data.links.forEach(drawLink);
          context.strokeStyle = "#999";
          context.stroke();

          context.beginPath();
          this.data.nodes.forEach(drawNode);
          context.fillStyle = '#206caf';
          context.strokeStyle = "#fff";
          context.fill();
          context.stroke();
        };

        function drawLink(d: any) {
          context.moveTo(d.source.x, d.source.y);
          context.lineTo(d.target.x, d.target.y);
        }

        function drawNode(d: any) {
          context.moveTo(d.x + radius, d.y);
          context.arc(d.x, d.y, radius, 0, 2 * Math.PI);
        }

        function dragsubject() {
          let subject = simulation.find(d3.event.x, d3.event.y, radius);
          console.log(subject);
          return subject;
        }

        function dragstarted() {
          console.log(d3.event);
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d3.event.subject.fx = d3.event.subject.x;
          d3.event.subject.fy = d3.event.subject.y;
        }

        function dragged() {
          d3.event.subject.fx = d3.event.x;
          d3.event.subject.fy = d3.event.y;
        }

        function dragended() {
          if (!d3.event.active) simulation.alphaTarget(0);
          d3.event.subject.fx = null;
          d3.event.subject.fy = null;
        }

        simulation
          .nodes(this.data.nodes)
          .on('tick', ticked);

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
        //       .on("start", dragstarted)
        //       .on("drag", dragged)
        //       .on("end", dragended));
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
    this.groups.node
      .selectAll('circle')
      .transition()
      .duration(500)
      .attr('fill', color)
  }
}
