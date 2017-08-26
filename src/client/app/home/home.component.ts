import {Component, DoCheck} from "@angular/core";
import {VkAuthService} from "../services/vk-auth.sevice";
import {ActivatedRoute, ParamMap} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'jg-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements DoCheck {

  _authorized: boolean;

  _urlParam: string;

  constructor(public _authService: VkAuthService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this._urlParam = params.get('id');
      console.log(this._urlParam);
    });
  }

  ngDoCheck(): void {
    console.log("do check");
    this._authorized = this._authService.isAuthorized();
  }
}
