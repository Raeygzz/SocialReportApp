import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { InAppPurchase } from '@ionic-native/in-app-purchase';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  hideSubscribedFacebook:boolean = false;
  hideSubscribedInstagram:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public nativeStorage: NativeStorage, private iap: InAppPurchase) {
    this.getProducts();
  }

  ionViewWillEnter(){
    let env = this;
    this.nativeStorage.getItem('whoViewedInstagramProfile').then((data)=>{
      env.hideSubscribedInstagram = true;
    });
    this.nativeStorage.getItem('whoViewedFbProfile').then((data)=>{
      env.hideSubscribedFacebook = true;
    });
  }

  cancelSubscriptionInstagram(){
    let env = this;
    this.nativeStorage.remove('whoViewedInstagramProfile').then(()=>{
      env.hideSubscribedInstagram = true;
    });
  }

  cancelSubscriptionFacebook(){
    let env = this;
    this.nativeStorage.remove('whoViewedFbProfile').then(()=>{
      env.hideSubscribedFacebook = true;
    });
  }

  getProducts(){
    this.iap
    .getProducts(['prod_in_photos_sub'])
    .then((products) => {
       alert(JSON.stringify(products));
    })
    .catch((err) => {
    });
  }

}
