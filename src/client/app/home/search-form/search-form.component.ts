import {Component, EventEmitter, Output} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'jg-search-form',
  templateUrl: 'search-form.component.html',
  styleUrls: ['search-form.component.css']
})
export class SearchFormComponent {

  @Output()
  onSearch: EventEmitter<string> = new EventEmitter<string>();

  searchQuery: string;

  _onSearch() {
    this.onSearch.emit(this.searchQuery);
  }
}
