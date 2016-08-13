import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {appRouting} from './app.routing';
import {LayoutModule} from './shared/layout/layout.module';
import {LoginModule} from './login/login.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CommonModule, FormsModule, LayoutModule, LoginModule, appRouting],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {

}
