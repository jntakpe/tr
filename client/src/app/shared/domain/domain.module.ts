import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {SecurityModule} from '../../security/security.module';
import {DomainService} from './domain.service';

@NgModule({
  imports: [HttpModule, SecurityModule],
  providers: [DomainService]
})
export class DomainModule {
}
