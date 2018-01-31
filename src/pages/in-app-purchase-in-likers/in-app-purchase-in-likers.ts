import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-in-app-purchase-in-likers',
  templateUrl: 'in-app-purchase-in-likers.html',
})
export class InAppPurchaseInLikersPage {

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
    .getProducts(['prod_in_likers_sub'])
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
    .subscribe('prod_in_likers_sub')
    .then((data)=> {
      alert(JSON.stringify(data));
      return this.iap.consume(data.productType, data.receipt, data.signature);
    }).then(() => {
      env.nativeStorage.setItem('prod_in_likers', "True")
      .then(
        () => env.navCtrl.pop(),
      );
    })
    .catch((err)=> {
      
    });
  }

}
