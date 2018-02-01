import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-in-app-purchase-fb-photos',
  templateUrl: 'in-app-purchase-fb-photos.html',
})
export class InAppPurchaseFbPhotosPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private iap: InAppPurchase, 
    private nativeStorage: NativeStorage,
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
    .getProducts(['prod_fb_photos_sub'])
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
    .subscribe('prod_fb_photos_sub')
    .then((data)=> {
      env.nativeStorage.setItem('prod_fb_photos', "True")
      .then(
        () => env.navCtrl.pop(),
      );
    })
    .catch((err)=> {
      alert(JSON.stringify(err));
    });
  }


}
