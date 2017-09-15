import {Component} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  moduleId: module.id,
  selector: 'jg-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent {

  constructor(title: Title) {
    title.setTitle('Jgauss – социальные графы');
  }

}
