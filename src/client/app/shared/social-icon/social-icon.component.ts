import {Component, Input} from '@angular/core';

export declare type SocialIconServiceType = 'vk' | 'facebook' | 'twitter' | 'instagram' | 'linkedin';

@Component({
  moduleId: module.id,
  selector: 'jg-social-icon',
  templateUrl: 'social-icon.component.html',
  styleUrls: ['social-icon.component.css']
})
export class SocialIconComponent {

  @Input()
  service: SocialIconServiceType;

  @Input()
  profile: string;
}
