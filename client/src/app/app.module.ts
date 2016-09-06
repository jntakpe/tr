import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {LayoutModule} from './shared/layout/layout.module';
import {SecurityModule} from './security/security.module';
import {appRouting} from './app.routing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgbModule, LayoutModule, SecurityModule, appRouting],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {

}
