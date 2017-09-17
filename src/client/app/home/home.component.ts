import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {GraphData} from "../shared/graph/graph-data.model";
import * as d3 from 'd3';

@Component({
  moduleId: module.id,
  selector: 'jg-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {

  _graphData: GraphData = {
    nodes: [],
    links: []
  };

  _loading: boolean = true;

  constructor(title: Title) {
    title.setTitle('Jgauss – социальные графы');
  }

  ngOnInit(): void {
    let check = () => {
      if (this._graphData.nodes.length && this._graphData.links.length) {
        this._graphData = Object.assign({}, this._graphData);
        this._loading = false;
      }
    };

    d3.csv("/assets/game-of-thrones/links.csv", (error, links) => {
      this._graphData.links = links;
      check();
    });

    d3.csv("/assets/game-of-thrones/nodes.csv", (error, nodes) => {
      this._graphData.nodes = nodes;
      check();
    });
  }

}
