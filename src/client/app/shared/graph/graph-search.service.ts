import {GraphData} from "./graph-data.model";

export interface GraphSearchService {

  setData(data: GraphData): this;

  sort(type: string, data?: any): this;

  search(query: string): this;

  getColorFunction(): { (data: any): string };

  reset(): void;
}
