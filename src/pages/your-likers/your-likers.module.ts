import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YourLikersPage } from './your-likers';

@NgModule({
  declarations: [
    YourLikersPage,
  ],
  imports: [
    IonicPageModule.forChild(YourLikersPage),
  ],
})
export class YourLikersPageModule {}
