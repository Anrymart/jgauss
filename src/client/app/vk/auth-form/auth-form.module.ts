import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {AuthFormComponent} from "./auth-form.component";

@NgModule({
  imports: [SharedModule],
  declarations: [AuthFormComponent],
  exports: [AuthFormComponent]
})
export class AuthFormModule {
}
