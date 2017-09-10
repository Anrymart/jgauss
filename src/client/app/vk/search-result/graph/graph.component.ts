import {
  AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, NgZone, OnChanges,
  Output
} from '@angular/core';
import * as d3 from 'd3';
import {Simulation, SimulationLinkDatum, SimulationNodeDatum} from 'd3-force';
import {BaseType, Selection} from 'd3-selection';
import {GraphData} from './graph-data.model';
import {PropertyHandler} from '../../../util/property-handler';
import {GraphSearchService} from "./graph-search.service";
import {ButtonGroupButtonModel} from "../../../shared/button-group/button-group.component";

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
      this._buttonGroupModel = [
        {name: 'default', text: 'Я', active: true},
        {name: 'owner-friends', text: 'Мои друзья'},
        {name: 'sex', text: 'Девушки/парни'},
        {name: 'target-likes', text: 'Лайкающие друзья'},
        {name: 'online', text: 'Пользователи онлайн'}];
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

  _buttonGroupModel: ButtonGroupButtonModel[] = [];

  private simulation: Simulation<SimulationNodeDatum, SimulationLinkDatum<SimulationNodeDatum>>;

  private groups: {
    container: Selection<BaseType, {}, BaseType, any>,
    node: Selection<BaseType, {}, BaseType, any>,
    link: Selection<BaseType, {}, BaseType, any>
  } = {node: null, link: null, container: null};

  constructor(private zone: NgZone,
              private changeDetectorRef: ChangeDetectorRef,
              private searchService: GraphSearchService) {
  }

  ngAfterViewInit(): void {
    this.resize();
    this.restart();
  }

  ngOnChanges(): void {
    this.restart();
  }

  restart(): void {
    console.log('restart graph');

    if (this._simulationState.paused) {
      return;
    }

    this.zone.runOutsideAngular(() => {
        let svg = d3.select('svg');
        let {width, height} = (<Element>svg.node()).getBoundingClientRect();

        let color = d3.scaleOrdinal(d3.schemeCategory20);

        if (!this.groups.container) {
          this.groups.container = svg.append('g');
        }
        let container = this.groups.container;

        let zoom = d3.zoom()
          .scaleExtent([0.3, 5])
          .on('zoom', () => {
            this.groups.container.attr('transform', d3.event.transform);
          });
        svg.call(zoom);

        if (!this.simulation) {
          this.simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(function (d: any) {
              return d.uid;
            }))
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(width / 2, height / 2));
        }
        let simulation = this.simulation;

        if (!this.groups.link) {
          this.groups.link = container.append('g')
            .attr('class', 'links');
        }

        let link = this.groups.link
          .selectAll('line')
          .data(this.data.links);
        link.exit().remove();
        link = link.enter().append('line').merge(link);

        if (!this.groups.node) {
          this.groups.node = container.append('g')
            .attr('class', 'nodes');
        }

        let node = this.groups.node
          .selectAll('circle')
          .data(this.data.nodes);
        node.exit().remove();
        let addedNode = node.enter().append('circle')
          .on('click', (data: any) => {
            d3.event.preventDefault();
            this.zone.run(() => {
              this._tipVisible = false;
              this.onUserClick.emit(data);
            });
          })
          .on('mouseover', (data: any) => {
            if (!this._simulationState.nodeDrag) {
              // this.zone.run(() => {
              data.event = d3.event;
              this._tipData = data;
              this._tipVisible = true;
              this.changeDetectorRef.detectChanges();
              // });
            }
          })
          .on('mouseout', (data: any) => {
            // this.zone.run(() => {
            this._tipVisible = false;
            this.changeDetectorRef.detectChanges();
            // });
          });

        node = addedNode.merge(node)
          .attr('r', 5)
          .attr('fill', this.searchService.getColorFunction());

        let dragstarted = (d: any) => {
          if (this._simulationState.paused) {
            return;
          }
          if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart();
          }
          d.fx = d.x;
          d.fy = d.y;

          this._simulationState.nodeDrag = true;
        };

        let dragged = (d: any) => {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        };

        let dragended = (d: any) => {
          if (!d3.event.active) {
            simulation.alphaTarget(0);
          }
          d.fx = null;
          d.fy = null;

          this._simulationState.nodeDrag = false;
        };

        node.call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

        simulation
          .nodes(this.data.nodes)
          .on('tick', ticked);

        simulation
          .force<any>('link')
          .links(this.data.links);

        simulation.alphaTarget(0.3).restart();

        function ticked() {
          link
            .attr('x1', function (d: any) {
              return d.source.x;
            })
            .attr('y1', function (d: any) {
              return d.source.y;
            })
            .attr('x2', function (d: any) {
              return d.target.x;
            })
            .attr('y2', function (d: any) {
              return d.target.y;
            });

          node
            .attr('cx', function (d: any) {
              return d.x;
            })
            .attr('cy', function (d: any) {
              return d.y;
            });
        }
      }
    );
  }

  @HostListener('window: resize')
  resize(): void {
    let height = document.documentElement.clientHeight;
    let graphElement = document.getElementById('jgauss-graph');
    if (graphElement) {
      let graphHeight = .8 * height + 'px';
      graphElement.style.height = graphHeight;
      graphElement.parentElement.style.height = graphHeight;
    }
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

  _sort(sortType?: string): void {
    let color = this.searchService.sort(sortType).getColorFunction();
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
