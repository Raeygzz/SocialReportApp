import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-in-app-purchase-in-crush',
  templateUrl: 'in-app-purchase-in-crush.html',
})
export class InAppPurchaseInCrushPage {

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
    .getProducts(['prod_in_crush_sub_final'])
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
  .buy('prod_in_crush_sub_final')
  .then(data => this.iap.consume(data.productType, data.receipt, data.signature))
  .then(() => {
    env.nativeStorage.setItem('prod_in_crush', "True")
    .then(
      () => env.navCtrl.pop(),
    );
    console.log('product was successfully consumed!')
  })
  .catch( err=> console.log(err))
  }
}
