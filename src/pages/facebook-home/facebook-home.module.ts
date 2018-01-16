import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacebookHomePage } from './facebook-home';

@NgModule({
  declarations: [
    FacebookHomePage,
  ],
  imports: [
    IonicPageModule.forChild(FacebookHomePage),
  ],
})
export class FacebookHomePageModule {}
