import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  hideSubscribedFacebook:boolean = false;
  hideSubscribedInstagram:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public nativeStorage: NativeStorage) {

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

}
