import {Component} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  moduleId: module.id,
  selector: 'jg-page-not-found',
  templateUrl: 'page-not-found.component.html',
  styleUrls: ['page-not-found.component.css']
})
export class PageNotFoundComponent {

  constructor(title: Title) {
    title.setTitle('Страница не найдена | Jgauss');
  }

}
