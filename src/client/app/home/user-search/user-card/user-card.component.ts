import {Component, Input} from "@angular/core";
import {PropertyHandler} from "../../../util/property-handler";
import {VkDataService} from "../../../services/vk-data.sevice";

@Component({
  moduleId: module.id,
  selector: 'jg-user-card',
  templateUrl: 'user-card.component.html',
  styleUrls: ['user-card.component.css']
})
export class UserCardComponent {

  @PropertyHandler({
    afterChange() {
      this.updateUserData();
    }
  })
  @Input()
  userId: string | number;

  @PropertyHandler({
    afterChange() {
    }
  })
  @Input()
  visible: boolean;

  _userData: any;

  constructor(dataService: VkDataService) {
  }

  private updateUserData(): void {
  }
}
