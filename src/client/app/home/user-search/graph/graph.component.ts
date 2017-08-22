import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  Output,
  ViewEncapsulation
} from '@angular/core';
import * as d3 from 'd3';
import {Simulation, SimulationLinkDatum, SimulationNodeDatum} from 'd3-force';
import {BaseType, Selection} from 'd3-selection';
import {GraphColors} from './graph-colors';
import {GraphData} from './graph-data';

@Component({
  moduleId: module.id,
  selector: 'jg-graph',
  templateUrl: 'graph.component.html',
  styleUrls: ['graph.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GraphComponent implements AfterViewInit, OnChanges {

  @Input()
  data: GraphData;

  @Output()
  onUserClick: EventEmitter<any> = new EventEmitter<any>();

  _tipData: any;
  _tipVisible: boolean;
  _nodeDrag: boolean;

  _searchQuery: string;

  private simulation: Simulation<SimulationNodeDatum, SimulationLinkDatum<SimulationNodeDatum>>;

  private groups: {
    container: Selection<BaseType, {}, BaseType, any>,
    node: Selection<BaseType, {}, BaseType, any>,
    link: Selection<BaseType, {}, BaseType, any>
  } = {node: null, link: null, container: null};

  constructor(private zone: NgZone) {
  }

  ngAfterViewInit(): void {
    this.resize();
    this.restart();
  }

  ngOnChanges(): void {
    this.restart();
  }

  restart() {
    console.log('restart graph');

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
            this.zone.run(() => {
              this._tipVisible = false;
              this.onUserClick.emit(data);
            });
          })
          .on('mouseover', (data: any) => {
            if (!this._nodeDrag) {
              this.zone.run(() => {
                data.event = d3.event;
                this._tipData = data;
                this._tipVisible = true;
              });
            }
          })
          .on('mouseout', (data: any) => {
            this.zone.run(() => {
              this._tipVisible = false;
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
          );

        let dragstarted = (d: any) => {
          if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart();
          }
          d.fx = d.x;
          d.fy = d.y;

          this._nodeDrag = true;
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
          this._nodeDrag = false;
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

  _sortByType(sortType: string): void {
    let color = d3.scaleOrdinal(d3.schemeCategory20);

    let paint = (d: any) => {
      return color(d);
    };
    switch (sortType) {
      case 'sex':
        paint = (d: { sex: 1 | 2 }) => {
          return GraphColors.sex[d.sex];
        };
        break;
      case 'online':
        paint = (d: { online: 0 | 1 }) => {
          return GraphColors.online[d.online];
        };
        break;
      case 'friends':
        paint = (d: any) => {
          switch (+d.uid) {
            case this.data.target && +this.data.target.uid:
              return GraphColors.target;
            case this.data.owner && +this.data.owner.uid:
              return GraphColors.owner;
            default:
              return color(null);
          }
        };
        break;
      case 'university':
        paint = (d: { university?: string }) => {
          return color(d.university);
        };
        break;
      case 'recent-friends':
        break;
      default:
        paint = (d: any) => {
          switch (+d.uid) {
            case this.data.target && +this.data.target.uid:
              return GraphColors.target;
            case this.data.owner && +this.data.owner.uid:
              return GraphColors.owner;
            default:
              return color(null);
          }
        };
        break;
    }

    let node = this.groups.node
      .selectAll('circle')
      .transition()
      .duration(500)
      .attr('fill', paint)
  }

  private sortByUid(uids: any[]): void {
    let color = d3.scaleOrdinal(d3.schemeCategory20);

    let paint = (d: any) => {
      if (~uids.indexOf(+d.uid)) {
        return '#206CAF';
      }
      return '#CCCCCC';
    };

    let node = this.groups.node
      .selectAll('circle')
      .transition()
      .duration(500)
      .attr('fill', paint)
  }

  @HostListener('window: resize')
  resize(): void {
    let height = document.documentElement.clientHeight;
    document.getElementById('jgauss-graph').style.height = 0.7 * height + 'px';
  }

  _onSearch() {
    if (!this._searchQuery) {
      this._sortByType();
      return;
    }
    let searchRegexp = new RegExp(this._searchQuery, 'i');
    let searchFields = ['first_name', 'last_name', 'domain', 'university_name', 'faculty_name'];
    let matchedNodes: number[] = [];
    this.data.nodes.forEach((node: any) => {
      for (let field of searchFields) {
        if (typeof node[field] == 'string' && node[field].search(searchRegexp) != -1) {
          matchedNodes.push(node.uid);
          break;
        }
      }
    });
    this.sortByUid(matchedNodes);
    console.log(this._searchQuery, matchedNodes);
  }

}
