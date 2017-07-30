import {AfterViewInit, ChangeDetectionStrategy, Component, Input, NgZone, ViewEncapsulation} from '@angular/core';
import * as d3 from 'd3';
import {ForceLink} from 'd3-force';
import {MOCK_DATA} from "./mock-data";

@Component({
  moduleId: module.id,
  selector: 'jg-graph',
  templateUrl: 'graph.component.html',
  styleUrls: ['graph.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphComponent implements AfterViewInit {

  private _data: { links, nodes };

  @Input()
  set data(data: { links, nodes }) {
    this._data = data;
  }

  get data(): { links, nodes } {
    return this._data;
  }

  constructor(private zone: NgZone) {
  }

  ngAfterViewInit(): void {
    if (!this._data) {
      this.setMockData();
    }

    this.zone.runOutsideAngular(() => {
        let svg = d3.select('svg'),
          width = +svg.attr('width'),
          height = +svg.attr('height');

        let color = d3.scaleOrdinal(d3.schemeCategory20);

        let simulation = d3.forceSimulation()
          .force('link', d3.forceLink().id(function (d: any): string {
            return d.id;
          }))
          .force('charge', d3.forceManyBody())
          .force('center', d3.forceCenter(width / 2, height / 2));

        //drawing MOCK_DATA
        let link = svg.append('g')
          .attr('class', 'links')
          .selectAll('line')
          .data(this._data.links)
          .enter().append('line');

        let node = svg.append('g')
          .attr('class', 'nodes')
          .selectAll('circle')
          .data(this._data.nodes)
          .enter().append('circle')
          .attr('r', 5)
          .attr('fill', function (d) {
            return color(d.group);
          })
          .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

        node.append('title')
          .text(function (d) {
            return d.name;
          });

        simulation
          .nodes(this._data.nodes)
          .on('tick', ticked);

        simulation.force<ForceLink>('link')
          .links(this._data.links);

        function ticked() {
          link
            .attr('x1', function (d) {
              return d.source.x;
            })
            .attr('y1', function (d) {
              return d.source.y;
            })
            .attr('x2', function (d) {
              return d.target.x;
            })
            .attr('y2', function (d) {
              return d.target.y;
            });

          node
            .attr('cx', function (d) {
              return d.x;
            })
            .attr('cy', function (d) {
              return d.y;
            });
        }

        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
      }
    );
  }

  private setMockData(): void {
    this._data = MOCK_DATA;
  }

}
