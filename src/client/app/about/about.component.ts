import {Component} from '@angular/core';
import {Title} from "@angular/platform-browser";

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'jg-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.css']
})
export class AboutComponent {
  constructor(title: Title) {
    title.setTitle('О сервисе | Jgauss');
  }
}
