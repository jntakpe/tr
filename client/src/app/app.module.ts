import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {LayoutModule} from './shared/layout/layout.module';
import {SecurityModule} from './security/security.module';
import {appRouting} from './app.routing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastOptions, ToastModule} from "ng2-toastr";



let options: ToastOptions = new ToastOptions({
  animate: 'flyRight',
  positionClass: 'toast-bottom-right',
});

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgbModule.forRoot(), LayoutModule, SecurityModule, appRouting, ToastModule.forRoot(options)],
  bootstrap: [AppComponent]
})
export class AppModule {

}
