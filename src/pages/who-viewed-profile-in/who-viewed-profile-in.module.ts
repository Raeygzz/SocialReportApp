import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WhoViewedProfileInPage } from './who-viewed-profile-in';

@NgModule({
  declarations: [
    WhoViewedProfileInPage,
  ],
  imports: [
    IonicPageModule.forChild(WhoViewedProfileInPage),
  ],
})
export class WhoViewedProfileInPageModule {}
