import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyLikesPage } from './my-likes';

@NgModule({
  declarations: [
    MyLikesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyLikesPage),
  ],
})
export class MyLikesPageModule {}
