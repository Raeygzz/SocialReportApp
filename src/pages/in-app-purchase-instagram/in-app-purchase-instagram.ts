import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-in-app-purchase-instagram',
  templateUrl: 'in-app-purchase-instagram.html',
})
export class InAppPurchaseInstagramPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private iap: InAppPurchase, private nativeStorage: NativeStorage) {
  }

  ionViewDidLoad() {
    this.getProducts();
  }

  closeModal(){
    this.navCtrl.pop();
  }

  getProducts(){
    this.iap
    .getProducts(['prod2_sub_final'])
    .then((products) => {
      // alert(JSON.stringify(products));
    })
    .catch((err) => {
      // alert(JSON.stringify(err));
    });
  }

  restore(){
    this.iap
    .restorePurchases()
    .then((data) => {
      // alert("Success Restore Products :"+JSON.stringify(data));
    }).catch((err) => {
      // alert("Error Restore Products :"+JSON.stringify(err));
    });
  }
  
  
  buyProducts(){
    let env = this;
      
    this.iap
    .buy('prod2_sub_final')
    .then(data => this.iap.consume(data.productType, data.receipt, data.signature))
    .then(() => {
      env.nativeStorage.setItem('whoViewedInstagramProfile', "True")
      .then(
        () => env.navCtrl.pop()
      );
      console.log('product was successfully consumed!')
    })
    .catch( err=> console.log(err))

    }

}
