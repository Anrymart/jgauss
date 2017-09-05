import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'jg-graph-toolbar',
  templateUrl: 'graph-toolbar.component.html',
  styleUrls: ['graph-toolbar.component.css'],
})
export class GraphToolbarComponent {

  @Input()
  loading: boolean;

  @Input()
  paused: boolean;

  @Output()
  onSearch: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  onPause: EventEmitter<boolean> = new EventEmitter<boolean>();

  _searchQuery: string;

  _onPause() {
    this.paused = !this.paused;
    this.onPause.emit(this.paused);
  }

  _onSearch() {
    this.onSearch.emit(this._searchQuery);
  }
}
