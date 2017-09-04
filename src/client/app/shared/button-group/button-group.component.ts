import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';

export interface ButtonGroupButtonModel {
  name: string;
  text: string;
  active?: boolean;
}

@Component({
  moduleId: module.id,
  selector: 'jg-button-group',
  templateUrl: 'button-group.component.html',
  styleUrls: ['button-group.component.css']
})
export class ButtonGroupComponent implements AfterViewInit {

  @Input()
  buttons: ButtonGroupButtonModel[];

  @Output()
  onClick: EventEmitter<string> = new EventEmitter<string>();

  ngAfterViewInit() {
    let hasActiveButton = this.buttons.some((button: ButtonGroupButtonModel) => {
      return button.active;
    });

    if (!hasActiveButton && this.buttons.length) {
      this.buttons[0].active = true;
    }
  }

  _onClick(name: string) {
    this.buttons.forEach((button: ButtonGroupButtonModel) => {
      button.active = (button.name == name);
    });
    this.onClick.emit(name);
  }
}
