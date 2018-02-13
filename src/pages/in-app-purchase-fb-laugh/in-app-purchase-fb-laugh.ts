import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-in-app-purchase-fb-laugh',
  templateUrl: 'in-app-purchase-fb-laugh.html',
})
export class InAppPurchaseFbLaughPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private iap: InAppPurchase, 
    private nativeStorage: NativeStorage,
  ) {
  }

  ionViewDidLoad() {
    // this.getProducts();
  }

  closeModal(){
    this.navCtrl.pop();
  }

  getProducts(){
    this.iap
    .getProducts(['prod_fb_laugh_sub_final'])
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
  .getProducts(['prod_fb_laugh_sub_final'])
  .then((products) => {
    env.iap
    .buy('prod_fb_laugh_sub_final')
    .then(data => {
      // alert("data "+JSON.stringify(data));
      env.iap.consume(data.productType, data.receipt, data.signature).then(() => {
        env.nativeStorage.setItem('prod_fb_laugh', "True")
          .then(
          () => env.navCtrl.pop(),
        );
        console.log('product was successfully consumed!')
      }).catch(() => {

      })
    }).catch((err) => {
      // alert("err "+JSON.stringify(err));
      if (err.code == '-6') {
        env.nativeStorage.setItem('prod_fb_laugh', "True")
          .then(
          () => env.navCtrl.pop(),
        );
      }
    })
  })
  .catch((err) => {

    this.iap
    .buy('prod_fb_laugh_sub_final')
    .then(data => {
      // alert("data "+JSON.stringify(data));
      env.iap.consume(data.productType, data.receipt, data.signature).then(() => {
        env.nativeStorage.setItem('prod_fb_laugh', "True")
          .then(
          () => env.navCtrl.pop(),
        );
        console.log('product was successfully consumed!')
      }).catch(() => {

      })
    }).catch((err) => {
      // alert("err "+JSON.stringify(err));
      if (err.code == '-6') {
        env.nativeStorage.setItem('prod_fb_laugh', "True")
          .then(
          () => env.navCtrl.pop(),
        );
      }
    })

  });


  }

}
