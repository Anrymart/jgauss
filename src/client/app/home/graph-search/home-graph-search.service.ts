import {Injectable} from "@angular/core";
import {GraphSearchService} from "../../shared/graph/graph-search.service";
import {GraphData} from "../../shared/graph/graph-data.model";

const COLORS = {
  blue: '#206caf',
  green: '#8bc34a',
  orange: '#ff5722',
  red: '#f44336',
  grey: '#cccccc'
};

@Injectable()
export class VkGraphSearchService implements GraphSearchService {

  private static readonly SEARCH_FIELDS: string[] = ['label'];

  private data: GraphData;

  private colorFunction: (data: any) => string;

  setData(data: GraphData): this {
    this.data = data;
    return this;
  }

  sort(type: string, data?: any): this {
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
      return COLORS.blue;
    };
  }
}
