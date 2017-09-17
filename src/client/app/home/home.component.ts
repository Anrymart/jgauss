import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";

@Component({
  moduleId: module.id,
  selector: 'jg-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(title: Title, private http: HttpClient) {
    title.setTitle('Jgauss – социальные графы');
  }

  ngOnInit(): void {

  }

}
