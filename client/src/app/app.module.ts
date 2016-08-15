import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {LayoutModule} from './shared/layout/layout.module';
import {SecurityModule} from './security/security.module';
import {appRouting} from './app.routing';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, LayoutModule, SecurityModule, appRouting],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {

}
