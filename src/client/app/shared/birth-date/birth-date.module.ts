import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BirthDatePipe} from "./birth-date.pipe";

@NgModule({
  imports: [CommonModule],
  declarations: [BirthDatePipe],
  exports: [BirthDatePipe]
})
export class BirthDateModule {
}
