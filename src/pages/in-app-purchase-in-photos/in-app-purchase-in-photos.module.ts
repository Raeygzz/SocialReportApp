import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InAppPurchaseInPhotosPage } from './in-app-purchase-in-photos';

@NgModule({
  declarations: [
    InAppPurchaseInPhotosPage,
  ],
  imports: [
    IonicPageModule.forChild(InAppPurchaseInPhotosPage),
  ],
})
export class InAppPurchaseInPhotosPageModule {}
