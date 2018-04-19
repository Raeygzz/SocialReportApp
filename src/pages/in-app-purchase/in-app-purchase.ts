import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoadingController } from 'ionic-angular';
import window from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-in-app-purchase',
  templateUrl: 'in-app-purchase.html',
})
export class InAppPurchasePage {

  eventName:string = "whoViewedFbProfile";
  eventValues:any = {"whoViewedFbProfileCurrency":"USD", "whoViewedFbProfileRevenue": "5"};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private iap: InAppPurchase,
    private nativeStorage: NativeStorage,
    public loading : LoadingController
  ) {

  }

  ionViewDidLoad() {
    // this.getProducts();
  }

  closeModal() {
    // window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
    this.navCtrl.pop();
  }

  getProducts() {
    this.iap
      .getProducts(['prod1_sub_final'])
      .then((products) => {
        // alert(JSON.stringify(products));
      })
      .catch((err) => {
      });
  }

  restore() {
    this.iap
      .restorePurchases()
      .then((data) => {
      }).catch((err) => {
      });
  }

  buyProducts() {
    let loader = this
    .loading
    .create({content: 'Loading..'});

    loader
    .present()
    .then(() => {
    let env = this;
    this.iap
    .getProducts(['prod1_sub_final'])
    .then((products) => {
      // alert(JSON.stringify(products));
      loader.dismiss();
      env.iap
      .buy('prod1_sub_final')
      .then(data => {
        loader.dismiss();
        alert('Felicidades! Ingresa a tu reporte desde la pagina principal.');
        this.iap.consume(data.productType, data.receipt, data.signature).then(() => {
          env.nativeStorage.setItem('whoViewedFbProfile', "True")
            .then(
            () => env.navCtrl.pop(),
          );
          window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
          console.log('product was successfully consumed!')
        }).catch(() => {
          loader.dismiss();
          env.nativeStorage.setItem('whoViewedFbProfile', "True")
          .then(
          () => env.navCtrl.pop(),
        );
        })
      }).catch((err) => {
        // alert(JSON.stringify(err));
        loader.dismiss();
        if (err.code == '-6') {
          alert('Felicidades! Ingresa a tu reporte desde la pagina principal.');
          env.nativeStorage.setItem('whoViewedFbProfile', "True")
            .then(
            () => env.navCtrl.pop(),
          );
        }

        if(err.code == '-9'){
          alert('Ya tienes acceso a este reporte. Ingresa desde la pagina principal');
          env.nativeStorage.setItem('whoViewedFbProfile', "True")
            .then(
            () => env.navCtrl.pop(),
          );
        }
      })
    })
    .catch((err) => {
      loader.dismiss();
      env.iap
      .buy('prod1_sub_final')
      .then(data => {
        // alert(JSON.stringify(data));
        loader.dismiss();
        alert('Felicidades! Ingresa a tu reporte desde la pagina principal.');
        this.iap.consume(data.productType, data.receipt, data.signature).then(() => {
          env.nativeStorage.setItem('whoViewedFbProfile', "True")
            .then(
            () => env.navCtrl.pop(),
          ).catch(() => {
            loader.dismiss();
          });
          window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
          console.log('product was successfully consumed!')
        }).catch(() => {
          loader.dismiss();
          env.nativeStorage.setItem('whoViewedFbProfile', "True")
          .then(
          () => env.navCtrl.pop(),
        );
        })
      }).catch((err) => {
        // alert(JSON.stringify(err));
        loader.dismiss();
        if (err.code == '-6') {
          alert('Felicidades! Ingresa a tu reporte desde la pagina principal.');
          env.nativeStorage.setItem('whoViewedFbProfile', "True")
            .then(
            () => env.navCtrl.pop(),
          );
        }

        if(err.code == '-9'){
          alert('Ya tienes acceso a este reporte. Ingresa desde la pagina principal');
          env.nativeStorage.setItem('whoViewedFbProfile', "True")
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
