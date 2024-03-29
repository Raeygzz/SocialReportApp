import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoadingController } from 'ionic-angular';
import window from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-in-app-purchase-instagram',
  templateUrl: 'in-app-purchase-instagram.html',
})
export class InAppPurchaseInstagramPage {

  eventName:string = "whoViewedInstaProfile";
  eventValues:any = {"whoViewedInstaProfileCurrency":"USD", "whoViewedInstaProfileRevenue": "5"};

  constructor(public navCtrl: NavController, public navParams: NavParams, private iap: InAppPurchase, private nativeStorage: NativeStorage, private loading: LoadingController) {
  }

  ionViewDidLoad() {
    // this.getProducts();
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
    let loader = this
    .loading
    .create({content: 'Loading..'});
    loader
    .present()
    .then(() => {
    this.iap
    .getProducts(['prod2_sub_final'])
    .then((products) => {
      loader.dismiss();
      // alert(JSON.stringify(products));
      env.iap
      .buy('prod2_sub_final')
      .then(data => {
        loader.dismiss();
        alert('Felicidades! Ingresa a tu reporte desde la pagina principal.');
        this.iap.consume(data.productType, data.receipt, data.signature).then(() => {
          env.nativeStorage.setItem('whoViewedInstagramProfile', "True")
            .then(
            () => env.navCtrl.pop(),
          );
          window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
          console.log('product was successfully consumed!')
        }).catch(() => {
          loader.dismiss();
          env.nativeStorage.setItem('whoViewedInstagramProfile', "True")
          .then(
          () => env.navCtrl.pop(),
        );
        })
      }).catch((err) => {
        loader.dismiss();
        // alert(JSON.stringify(err));
        if (err.code == '-6') {
          alert('Felicidades! Ingresa a tu reporte desde la pagina principal.');
          env.nativeStorage.setItem('whoViewedInstagramProfile', "True")
            .then(
            () => env.navCtrl.pop(),
          );
        }
        if (err.code == '-9') {
          alert('Ya tienes acceso a este reporte. Ingresa desde la pagina principal');
          env.nativeStorage.setItem('whoViewedInstagramProfile', "True")
            .then(
            () => env.navCtrl.pop(),
          );
        }
      })
    })
    .catch((err) => {
      loader.dismiss();
      // alert(JSON.stringify(err));
      env.iap
      .buy('prod2_sub_final')
      .then(data => {
        loader.dismiss();
        alert('Felicidades! Ingresa a tu reporte desde la pagina principal.');
        this.iap.consume(data.productType, data.receipt, data.signature).then(() => {
          env.nativeStorage.setItem('whoViewedInstagramProfile', "True")
            .then(
            () => env.navCtrl.pop(),
          );
          window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
          console.log('product was successfully consumed!')
        }).catch(() => {
          loader.dismiss();
          env.nativeStorage.setItem('whoViewedInstagramProfile', "True")
          .then(
          () => env.navCtrl.pop(),
        );
        })
      }).catch((err) => {
        loader.dismiss();
        // alert(JSON.stringify(err));
        if (err.code == '-6') {
          alert('Felicidades! Ingresa a tu reporte desde la pagina principal.');
          env.nativeStorage.setItem('whoViewedInstagramProfile', "True")
            .then(
            () => env.navCtrl.pop(),
          );
        }
        if (err.code == '-9') {
          alert('Ya tienes acceso a este reporte. Ingresa desde la pagina principal');
          env.nativeStorage.setItem('whoViewedInstagramProfile', "True")
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
