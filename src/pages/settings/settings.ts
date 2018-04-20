import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  hideSubscribedFacebook:boolean = false;
  hideSubscribedInstagram:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public nativeStorage: NativeStorage, private iab: InAppBrowser) {
    
  }

  ionViewWillEnter(){
    this.getProducts();
  }

  cancelSubscriptionInstagram(){
    this.nativeStorage.remove('prod_in_crush');
    this.nativeStorage.remove('prod_in_likers');
    this.nativeStorage.remove('prod_in_photos');
    this.nativeStorage.remove('whoViewedInstagramProfile');
    this.hideSubscribedInstagram = false;
  }

  cancelSubscriptionFacebook(){
    this.nativeStorage.remove('whoViewedFbProfile');
    this.nativeStorage.remove('prod_fb_crush');
    this.nativeStorage.remove('prod_fb_laugh');
    this.nativeStorage.remove('prod_fb_likers');
    this.nativeStorage.remove('prod_fb_lovers');
    this.nativeStorage.remove('prod_fb_photos');
    this.hideSubscribedFacebook = false;
  }

  getProducts(){
    let env = this;
    this.nativeStorage.keys().then((data)=>{
      if(data.indexOf("whoViewedFbProfile") != -1 || data.indexOf("prod_fb_crush") != -1 || data.indexOf("prod_fb_laugh") != -1 || data.indexOf("prod_fb_likers") != -1 || data.indexOf("prod_fb_lovers") != -1 || data.indexOf("prod_fb_photos") != -1){
        env.hideSubscribedFacebook = true;
      }
      else{
        env.hideSubscribedFacebook = false;
      }

      if(data.indexOf("prod_in_crush") != -1 || data.indexOf("prod_in_likers") != -1 || data.indexOf("prod_in_photos") != -1 || data.indexOf("whoViewedInstagramProfile") != -1){
        env.hideSubscribedInstagram = true;
      }
      else{
        env.hideSubscribedInstagram = false;
      }
    });
  }

  termsAndCondition(){
    let url = 'https://www.google.com/';
    this.iab.create(url);
  }

}
