import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {appRouting} from './app.routing';
import {LayoutModule} from './shared/layout/layout.module';
import {SecurityModule} from './security/security.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CommonModule, FormsModule, LayoutModule, SecurityModule, appRouting],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {

}
