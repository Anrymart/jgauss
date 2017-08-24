import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NumeralPipe} from "./numeral.pipe";

@NgModule({
  imports: [CommonModule],
  declarations: [NumeralPipe],
  exports: [NumeralPipe]
})
export class NumeralModule {
}
