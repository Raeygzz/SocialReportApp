import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoadingController } from 'ionic-angular';
import window from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-in-app-purchase-fb-crush',
  templateUrl: 'in-app-purchase-fb-crush.html',
})
export class InAppPurchaseFbCrushPage {

  eventName:string = "fanoftheweek";
  eventValues:any = {"af_currency":"USD", "af_revenue": "5"};

  // eventName:string = "crushfbprofile";
  // eventValues:any = {"crushFbProfileCurrency":"USD", "crushFbProfileRevenue": "5"};

  // eventName:string = "af_purchase_crush";
  // eventValues:any = {"af_currency":"USD", "af_revenue": "5"};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private iap: InAppPurchase, 
    private nativeStorage: NativeStorage,
    public loading : LoadingController
  ) {

  }

  // ionViewWillEnter() {
  //   this.nativeStorage.setItem('prod_fb_crush', "True")
  //     .then(() => {
  //       // window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
  //       this.navCtrl.pop()
  //     });
  // }

  ionViewDidLoad() {
    // this.getProducts();
  }

  closeModal(){
    this.navCtrl.pop();
  }

  getProducts(){
    this.iap
    .getProducts(['prod_fb_crush_sub_final'])
    .then((products) => {
      //  alert(JSON.stringify(products));
    })
    .catch((err) => {
        // alert(JSON.stringify(err));
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
    .getProducts(['prod_fb_crush_sub_final'])
    .then((products) => {
      // alert(JSON.stringify(products));
      loader.dismiss();
      env.iap
      .buy('prod_fb_crush_sub_final')
      .then(data => {
        loader.dismiss();
        window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
        alert('Felicidades! Ingresa a tu reporte desde la pagina principal.');
        this.iap.consume(data.productType, data.receipt, data.signature).then(() => {
          env.nativeStorage.setItem('prod_fb_crush', "True")
          .then(() => {
            window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
            env.navCtrl.pop()
          });
          window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
          console.log('product was successfully consumed!')
        }).catch(() => {
          loader.dismiss();
          window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
          env.nativeStorage.setItem('prod_fb_crush', "True")
          .then(() => {
            window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
            env.navCtrl.pop()
          }
          );
          window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);  //edited
        })
      }).catch((err) => {
        loader.dismiss();
        // alert(JSON.stringify(err));
        if(err.code == '-6'){
          alert('Felicidades! Ingresa a tu reporte desde la pagina principal.');
          env.nativeStorage.setItem('prod_fb_crush', "True")
          .then(
            () => env.navCtrl.pop(),
          );
        }
        if(err.code == '-9'){
          alert('Ya tienes acceso a este reporte. Ingresa desde la pagina principal');
          env.nativeStorage.setItem('prod_fb_crush', "True")
          .then(
            () => env.navCtrl.pop(),
          );
        }
      })
    })
    .catch((err) => {
        // alert(JSON.stringify(err));
        loader.dismiss();
        env.iap
        .buy('prod_fb_crush_sub_final')
        .then(data => {
          loader.dismiss();
          window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
          alert('Felicidades! Ingresa a tu reporte desde la pagina principal.');
          this.iap.consume(data.productType, data.receipt, data.signature).then(() => {
            env.nativeStorage.setItem('prod_fb_crush', "True")
            .then(() => {
              window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
              env.navCtrl.pop()
            });
            window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
            console.log('product was successfully consumed!')
          }).catch(() => {
            loader.dismiss();
            window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
            env.nativeStorage.setItem('prod_fb_crush', "True")
            .then(() => {
              window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues);
              env.navCtrl.pop()
            });
            window.plugins.appsFlyer.trackEvent(this.eventName, this.eventValues); //edited
          })
        }).catch((err) => {
          loader.dismiss();
           
          if(err.code == '-6'){
            alert('Felicidades! Ingresa a tu reporte desde la pagina principal.');
            env.nativeStorage.setItem('prod_fb_crush', "True")
            .then(
              () => env.navCtrl.pop(),
            );
          }
          if(err.code == '-9'){
            alert('Ya tienes acceso a este reporte. Ingresa desde la pagina principal');
            env.nativeStorage.setItem('prod_fb_crush', "True")
            .then(
              () => env.navCtrl.pop(),
            );
          }
        })
    });

  }).catch(() => {
    loader.dismiss();
    });
  }
}
