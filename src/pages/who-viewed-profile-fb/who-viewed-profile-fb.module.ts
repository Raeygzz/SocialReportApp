import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WhoViewedProfileFbPage } from './who-viewed-profile-fb';

@NgModule({
  declarations: [
    WhoViewedProfileFbPage,
  ],
  imports: [
    IonicPageModule.forChild(WhoViewedProfileFbPage),
  ],
})
export class WhoViewedProfileFbPageModule {}
