import {Injectable} from "@angular/core";
import {GraphData} from "./graph-data.model";

const COLORS = {
  blue: '#206caf',
  green: '#8bc34a',
  orange: '#ff5722',
  red: '#f44336',
  grey: '#cccccc'
};

@Injectable()
export class GraphSearchService {

  private static readonly SEARCH_FIELDS: string[] =
    ['first_name', 'last_name', 'domain', 'university_name', 'faculty_name', 'city_name', 'home_town'];

  private data: GraphData;

  private colorFunction: (data: any) => string;

  setData(data: GraphData): this {
    this.data = data;
    return this;
  }

  sort(type: string): this {

    let colorFunction: (d: any) => string = this.getDefaultColorFunction();

    switch (type) {
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
      case 'recent-friends':
        break;
    }

    this.colorFunction = colorFunction;

    return this;
  }

  search(query: string): this {
    let searchRegexp = new RegExp(query, 'i');
    let matchedNodes: number[] = [];

    this.data.nodes.forEach((node: any) => {
      for (let field of GraphSearchService.SEARCH_FIELDS) {
        if (typeof node[field] == 'string' && node[field].search(searchRegexp) != -1) {
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

    this.getBestFriends();

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

  private getBestFriends(): number[] {
    if (this.data.target.bestFriends) {
      return this.data.target.bestFriends;
    }
    let rankedFriends = this.data.nodes
      .filter((node: any) => {
        return node.uid != this.data.target.uid
      })
      .map((node: any) => {
        return {
          name: node.first_name + ' ' + node.last_name,
          id: node.uid,
          rank: node.common_friends.length / Math.cbrt(node.friends.length)
        };
      })
      .sort((a: any, b: any): number => {
        return b.rank - a.rank;
      });
    console.log(rankedFriends);
    return this.data.target.bestFriends;
  }
}
