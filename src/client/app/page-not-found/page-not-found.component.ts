import {AfterViewInit, Component, NgZone} from '@angular/core';
import * as d3 from 'd3';
import {Title} from "@angular/platform-browser";

const data = {
  "nodes": [
    {"id": "0", "group": 1},
    {"id": "1", "group": 1},
    {"id": "1-1", "group": 1},
    {"id": "6", "group": 1},
    {"id": "1-6", "group": 1},
    {"id": "2", "group": 1},
    {"id": "1-2", "group": 1},
    {"id": "3", "group": 1},
    {"id": "1-3", "group": 1},
    {"id": "4", "group": 1},
    {"id": "1-4", "group": 1},
    {"id": "5", "group": 1},
    {"id": "1-5", "group": 1}
  ],
  "links": [
    {"source": "0", "target": "1", "value": 1},
    {"source": "0", "target": "2", "value": 1},
    {"source": "0", "target": "3", "value": 1},
    {"source": "0", "target": "4", "value": 1},
    {"source": "0", "target": "5", "value": 1},
    {"source": "0", "target": "6", "value": 1},
    {"source": "1", "target": "2", "value": 1},
    {"source": "2", "target": "3", "value": 1},
    {"source": "3", "target": "4", "value": 1},
    {"source": "4", "target": "5", "value": 1},
    {"source": "5", "target": "6", "value": 1},
    {"source": "6", "target": "1", "value": 1},
    {"source": "1", "target": "1-1", "value": 1},
    {"source": "2", "target": "1-2", "value": 1},
    {"source": "3", "target": "1-3", "value": 1},
    {"source": "4", "target": "1-4", "value": 1},
    {"source": "5", "target": "1-5", "value": 1},
    {"source": "6", "target": "1-6", "value": 1}
  ]
};

@Component({
  moduleId: module.id,
  selector: 'jg-page-not-found',
  templateUrl: 'page-not-found.component.html',
  styleUrls: ['page-not-found.component.css']
})
export class PageNotFoundComponent implements AfterViewInit {

  constructor(private zone: NgZone, title: Title) {
    title.setTitle('Страница не найдена | Jgauss');
  }

  ngAfterViewInit(): void {

    this.zone.runOutsideAngular(() => {

      let svg = d3.select("#jgauss-web"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

      let simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d: { id: string }) {
          return d.id;
        }).strength(1))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("center", d3.forceCenter(width / 2, height / 2));

      let link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line");

      let node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function () {
          return '#EF5350';
        })
        .call(<any>d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

      simulation
        .nodes(data.nodes)
        .on("tick", ticked);

      simulation
        .force<any>("link")
        .links(data.links);

      function ticked() {
        link
          .attr("x1", function (d: any) {
            return d.source.x;
          })
          .attr("y1", function (d: any) {
            return d.source.y;
          })
          .attr("x2", function (d: any) {
            return d.target.x;
          })
          .attr("y2", function (d: any) {
            return d.target.y;
          });

        node
          .attr("cx", function (d: any) {
            return d.x;
          })
          .attr("cy", function (d: any) {
            return d.y;
          });
      }

      function dragstarted(d: any) {
        if (!d3.event.active) {
          simulation.alphaTarget(0.8).restart();
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

    });
  }
}
