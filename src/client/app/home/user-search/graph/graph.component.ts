import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component, EventEmitter,
  Input,
  NgZone,
  OnChanges, Output,
  ViewEncapsulation
} from '@angular/core';
import * as d3 from 'd3';
import {Simulation, SimulationLinkDatum, SimulationNodeDatum} from 'd3-force';
import {MOCK_DATA} from './mock-data';
import {BaseType, Selection} from 'd3-selection';
import {GraphColors} from './graph-colors';
import {GraphData} from './graph-data';

@Component({
  moduleId: module.id,
  selector: 'jg-graph',
  templateUrl: 'graph.component.html',
  styleUrls: ['graph.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphComponent implements AfterViewInit, OnChanges {

  @Input()
  data: GraphData;

  @Output()
  onUserSelect: EventEmitter<any> = new EventEmitter<any>();

  private simulation: Simulation<SimulationNodeDatum, SimulationLinkDatum<SimulationNodeDatum>>;
  private groups: {
    container: Selection<BaseType, {}, BaseType, any>,
    node: Selection<BaseType, {}, BaseType, any>,
    link: Selection<BaseType, {}, BaseType, any>
  } = {node: null, link: null, container: null};

  constructor(private zone: NgZone) {
  }

  ngAfterViewInit(): void {
    if (!this.data) {
      this.setMockData();
    }
    this.restart();
  }

  ngOnChanges(): void {
    console.log('onChanges');
    this.restart();
  }

  restart() {
    console.log('restart');

    this.zone.runOutsideAngular(() => {
        let svg = d3.select('svg'),
          width = +svg.attr('width'),
          height = +svg.attr('height');

        let color = d3.scaleOrdinal(d3.schemeCategory20);

        if (!this.groups.container) {
          this.groups.container = svg.append('g');
        }
        let container = this.groups.container;

        let zoom = d3.zoom()
          .scaleExtent([0.4, 5])
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
            this.zone.run(() => {
              this.onUserSelect.emit(data);
            });
          });
        node = addedNode.merge(node)
          .attr('r', 5)
          .attr('fill', (d: any) => {
              switch (+d.uid) {
                case this.data.target && +this.data.target.uid:
                  return GraphColors.target;
                case this.data.owner && +this.data.owner.uid:
                  return GraphColors.owner;
                default:
                  return color('');
              }
            }
          )
          .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

        addedNode.append('title')
          .text(function (d: any) {
            return `${d.first_name} ${d.last_name}`;
          });

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

        function dragstarted(d: any) {
          if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart();
          }
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d: any) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d: any) {
          if (!d3.event.active) {
            simulation.alphaTarget(0);
          }
          d.fx = null;
          d.fy = null;
        }
      }
    );
  }

  private setMockData(): void {
    this.data = MOCK_DATA;
  }

}
