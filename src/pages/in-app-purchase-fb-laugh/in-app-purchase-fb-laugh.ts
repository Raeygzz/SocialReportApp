import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoadingController } from 'ionic-angular';
import window from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-in-app-purchase-fb-laugh',
  templateUrl: 'in-app-purchase-fb-laugh.html',
})
export class InAppPurchaseFbLaughPage {

  eventName:string = "laughFbProfile";
  eventValues:any = {"laughFbProfileCurrency":"USD", "laughFbProfileRevenue": "5"};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private iap: InAppPurchase, 
    private nativeStorage: NativeStorage,
    private loading: LoadingController
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
  let loader = this
  .loading
  .create({content: 'Loading..'});
  loader
  .present()
  .then(() => {
  this.iap
  .getProducts(['prod_fb_laugh_sub_final'])
  .then((products) => {
    loader.dismiss();
    env.iap
    .buy('prod_fb_laugh_sub_final')
    .then(data => {
      loader.dismiss();
      alert('Felicidades! Ingresa a tu reporte desde la pagina principal.');
      env.iap.consume(data.productType, data.receipt, data.signature).then(() => {
        env.nativeStorage.setItem('prod_fb_laugh', "True")
          .then(
          () => env.navCtrl.pop(),
        );
        window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
        console.log('product was successfully consumed!')
      }).catch(() => {
        loader.dismiss();
        env.nativeStorage.setItem('prod_fb_laugh', "True")
          .then(
          () => env.navCtrl.pop(),
        );
      })
    }).catch((err) => {
      loader.dismiss();
      // alert("err "+JSON.stringify(err));
      if (err.code == '-6') {
        alert('Felicidades! Ingresa a tu reporte desde la pagina principal.');
        env.nativeStorage.setItem('prod_fb_laugh', "True")
          .then(
          () => env.navCtrl.pop(),
        );
      }
      if (err.code == '-9') {
        alert('Ya tienes acceso a este reporte. Ingresa desde la pagina principal');
        env.nativeStorage.setItem('prod_fb_laugh', "True")
          .then(
          () => env.navCtrl.pop(),
        );
      }
    })
  })
  .catch((err) => {
    loader.dismiss();
    this.iap
    .buy('prod_fb_laugh_sub_final')
    .then(data => {
      loader.dismiss();
      // alert("data "+JSON.stringify(data));
      alert('Felicidades! Ingresa a tu reporte desde la pagina principal.');
      env.iap.consume(data.productType, data.receipt, data.signature).then(() => {
        env.nativeStorage.setItem('prod_fb_laugh', "True")
          .then(
          () => env.navCtrl.pop(),
        );
        window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
        console.log('product was successfully consumed!')
      }).catch(() => {
        loader.dismiss();
        env.nativeStorage.setItem('prod_fb_laugh', "True")
          .then(
          () => env.navCtrl.pop(),
        );
      })
    }).catch((err) => {
      loader.dismiss();
      // alert("err "+JSON.stringify(err));
      if (err.code == '-6') {
        alert('Felicidades! Ingresa a tu reporte desde la pagina principal.');
        env.nativeStorage.setItem('prod_fb_laugh', "True")
          .then(
          () => env.navCtrl.pop(),
        );
      }
      if (err.code == '-9') {
        alert('Ya tienes acceso a este reporte. Ingresa desde la pagina principal');
        env.nativeStorage.setItem('prod_fb_laugh', "True")
          .then(
          () => env.navCtrl.pop(),
        );
      }
    })

  });

}).catch(() => {
  loader.dismiss();
})


  }

}
