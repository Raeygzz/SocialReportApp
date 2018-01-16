import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacebookProfilePage } from './facebook-profile';

@NgModule({
  declarations: [
    FacebookProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(FacebookProfilePage),
  ],
})
export class FacebookProfilePageModule {}
