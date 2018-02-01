import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-in-app-purchase-in-photos',
  templateUrl: 'in-app-purchase-in-photos.html',
})
export class InAppPurchaseInPhotosPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private iap: InAppPurchase, 
    private nativeStorage: NativeStorage,
    private alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    this.getProducts();
  }

  closeModal(){
    this.navCtrl.pop();
  }

  getProducts(){
    this.iap
    .getProducts(['prod_in_photos_sub'])
    .then((products) => {
      alert(JSON.stringify(products));
    })
    .catch((err) => {
      alert(JSON.stringify(err));
    });
  }

  restore(){
    this.iap
    .restorePurchases()
    .then((data) => {
    }).catch((err) => {
    });
  }
  
  
  buyProducts(){
    let env = this;
    this.iap
    .subscribe('prod_in_photos_sub')
    .then((data) => {
      env.nativeStorage.setItem('prod_in_photos', "True")
      .then(
        () => env.navCtrl.pop(),
      );
    })
    .catch((err)=> {
      alert(JSON.stringify(err));
    });
  }

}
