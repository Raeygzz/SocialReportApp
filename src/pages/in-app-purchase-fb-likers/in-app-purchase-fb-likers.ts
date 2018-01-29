import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-in-app-purchase-fb-likers',
  templateUrl: 'in-app-purchase-fb-likers.html',
})
export class InAppPurchaseFbLikersPage {

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
    .getProducts(['prod_fb_likers_sub'])
    .then((products) => {
       
    })
    .catch((err) => {
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
    .buy('prod_fb_likers_sub')
    .then((data)=> {
      return this.iap.consume(data.productType, data.receipt, data.signature);
    }).then(() => {
      env.nativeStorage.setItem('prod_fb_likers', "True")
      .then(
        () => env.navCtrl.pop(),
      );
    })
    .catch((err)=> {
      
    });
  }

}
