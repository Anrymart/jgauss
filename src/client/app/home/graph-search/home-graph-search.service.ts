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
export class HomeGraphSearchService implements GraphSearchService {

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
    console.log('query');

    let searchRegexp = new RegExp(query, 'i');
    let matchedNodes: string[] = [];

    this.data.nodes.forEach((node: any) => {
      for (let field of HomeGraphSearchService.SEARCH_FIELDS) {
        if (String(node[field]).search(searchRegexp) != -1) {
          matchedNodes.push(node.id);
          break;
        }
      }
    });

    this.colorFunction = (d: { id: string }) => {
      if (matchedNodes.includes(d.id)) {
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

  private getDefaultColorFunction(): { (d: { id: number }): string } {
    return (d: { id: number }) => {
      return COLORS.blue;
    };
  }
}
