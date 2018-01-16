import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InstagramHomePage } from './instagram-home';

@NgModule({
  declarations: [
    InstagramHomePage,
  ],
  imports: [
    IonicPageModule.forChild(InstagramHomePage),
  ],
})
export class InstagramHomePageModule {}
