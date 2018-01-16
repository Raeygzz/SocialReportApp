import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MostLikedPhotoFbPage } from './most-liked-photo-fb';

@NgModule({
  declarations: [
    MostLikedPhotoFbPage,
  ],
  imports: [
    IonicPageModule.forChild(MostLikedPhotoFbPage),
  ],
})
export class MostLikedPhotoFbPageModule {}
