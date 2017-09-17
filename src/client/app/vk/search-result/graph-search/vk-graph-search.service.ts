import {Injectable} from "@angular/core";
import * as d3 from 'd3';
import {GraphData} from "../../../shared/graph/graph-data.model";
import {GraphSearchService} from "../../../shared/graph/graph-search.service";

const COLORS = {
  blue: '#206caf',
  green: '#8bc34a',
  orange: '#ff5722',
  red: '#f44336',
  grey: '#cccccc'
};

@Injectable()
export class VkGraphSearchService implements GraphSearchService {

  private static readonly SEARCH_FIELDS: string[] =
    ['uid', 'first_name', 'last_name', 'domain', 'university_name', 'faculty_name', 'city_name', 'home_town'];

  private data: GraphData;

  private colorFunction: (data: any) => string;

  setData(data: GraphData): this {
    this.data = data;
    return this;
  }

  sort(type: string, data?: any): this {

    let colorFunction: (d: any) => string = this.getDefaultColorFunction();

    switch (type) {
      case 'owner-friends':
        if (this.data.owner && this.data.owner.friends) {
          colorFunction = (d: { uid: number }) => {
            if (~this.data.owner.friends.indexOf(d.uid)) {
              return COLORS.blue;
            }
            if (d.uid == this.data.owner.uid) {
              return COLORS.orange;
            }
            return COLORS.grey;
          };
        }
        break;
      case 'sex':
        colorFunction = (d: { sex: 1 | 2 }) => {
          switch (+d.sex) {
            case 1:
              return COLORS.red;
            case 2:
              return COLORS.blue;
            default:
              return COLORS.grey;
          }
        };
        break;
      case 'online':
        colorFunction = (d: { online: 0 | 1 }) => {
          switch (+d.online) {
            case 1:
              return COLORS.green;
            default:
              return COLORS.blue;
          }
        };
        break;
      case 'target-likes':
        if (this.data.target.friendLikes) {
          let color = d3.scaleLinear()
            .domain([0, this.data.target.friendLikes.max / 2 || 1])
            .range(<any>[COLORS.grey, COLORS.red]);
          colorFunction = (d: { uid: number }) => {
            return <any>color(this.data.target.friendLikes[d.uid] || 0);
          };
        }
        break;
      case 'friends':
        colorFunction = (d: { uid: number }) => {
          if (data.friends.includes(d.uid)) {
            return COLORS.blue;
          } else if (data.uid == d.uid) {
            return COLORS.green;
          }
          return COLORS.grey;
        }
    }

    this.colorFunction = colorFunction;

    return this;
  }

  search(query: string): this {
    let searchRegexp = new RegExp(query, 'i');
    let matchedNodes: number[] = [];

    this.data.nodes.forEach((node: any) => {
      for (let field of VkGraphSearchService.SEARCH_FIELDS) {
        if (String(node[field]).search(searchRegexp) != -1) {
          matchedNodes.push(node.uid);
          break;
        }
      }
    });

    this.colorFunction = (d: { uid: number }) => {
      if (matchedNodes.includes(+d.uid)) {
        return COLORS.blue;
      }
      return COLORS.grey;
    };

    return this;
  }

  getColorFunction(): { (data: any): string } {
    if (!this.colorFunction) {
      this.colorFunction = this.getDefaultColorFunction();
    }
    return this.colorFunction;
  }

  reset(): void {
    this.colorFunction = null;
  }

  private getDefaultColorFunction(): { (d: { uid: number }): string } {
    return (d: { uid: number }) => {
      switch (d.uid) {
        case this.data.target && this.data.target.uid:
          return COLORS.green;
        case this.data.owner && this.data.owner.uid:
          return COLORS.orange;
        default:
          return COLORS.blue;
      }
    };
  }
}
