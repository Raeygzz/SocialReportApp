import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ModalController, ViewController } from 'ionic-angular';
import { ModalContentComponent } from '../../components/modal-content/modal-content';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  hideSubscribedFacebook:boolean = false;
  hideSubscribedInstagram:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public nativeStorage: NativeStorage, private iab: InAppBrowser, public modalCtrl: ModalController, public viewCtrl: ViewController, private alertCtrl: AlertController) {
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
    let alert = this.alertCtrl.create({
      title: 'Estas seguro de que quieres dejar de ver quien ve tu perfil en Facebook?',
      buttons: [
        {
          text: 'Seguir Viendo',
          role: 'cancel',
          handler: () => {
            console.log('do not cancel suscriptions');
          }
        },
        {
          text: 'Dar De Baja',
          role: 'Yes',
          handler: () => {
            // alert.dismiss().then(() => {
            console.log('cancel sunscription');
            this.nativeStorage.remove('whoViewedFbProfile');
            this.nativeStorage.remove('prod_fb_crush');
            this.nativeStorage.remove('prod_fb_laugh');
            this.nativeStorage.remove('prod_fb_likers');
            this.nativeStorage.remove('prod_fb_lovers');
            this.nativeStorage.remove('prod_fb_photos');
            this.hideSubscribedFacebook = false;
          // });
          // return false;
          }
        }]
    });
    alert.present();
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

  openModal() {
    let modal = this.modalCtrl.create(ModalContentComponent);
    modal.present();
  }
}
