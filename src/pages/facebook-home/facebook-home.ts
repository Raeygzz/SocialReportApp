import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoadingController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { FacebookProfilePage } from '../facebook-profile/facebook-profile';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FacebookService } from '../../providers/facebook-service';
import { ToastController } from 'ionic-angular';
import { SqliteService } from '../../providers/sqlite';

@IonicPage()
@Component({
  selector: 'page-facebook-home',
  templateUrl: 'facebook-home.html',
})

export class FacebookHomePage {

  isFbLoggedIn: boolean = false;
  pageReady: boolean = false;
  FB_APP_ID: number = 753939148127516;

  constructor(
    public navCtrl: NavController,
    public UserService: UserService,
    public loading: LoadingController,
    public fb: Facebook,
    private nativeStorage: NativeStorage,
    private iab: InAppBrowser,
    public facebookService: FacebookService,
    public toastCtrl: ToastController,
    public sqliteService: SqliteService,
  ) {
    this.fb.browserInit(this.FB_APP_ID, "v2.11");
  }

  ionViewWillEnter() {
    this.isFbLoggedIn = false;
    // let db = this.sqliteService.getDbInstance();
    let loader = this.loading.create({
      content: 'Loading..',
    });
    loader.present().then(() => {
      this.nativeStorage.getItem("fbUser")
        .then(
        data => {
          loader.dismiss();

          // db.executeSql('Select * from FacebookPhotos', [])
          //   .then((data) => {
          //     if (data.rows.length > 0) {
                this.isFbLoggedIn = true;
                this.pageReady = true;
            //   }
            // });

        },
        error => {
          this.pageReady = true;
          localStorage.setItem("newFbLogin", "true");
          loader.dismiss();
        }
        ).catch(() => {

        });
    }).catch(() => {

    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'No Internet Connection',
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }


  infoToast() {
    let toast = this.toastCtrl.create({
      message: 'Connection Failed',
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  facebookLogin() {
    if (localStorage.getItem("online") == "false") {
      this.presentToast();
      return;
    }

    let permissions = new Array<string>();
    let loader = this.loading.create({
      content: 'Loading..',
    });
    let env = this;
    //the permissions your facebook app needs from the user
    permissions = ["public_profile", "user_photos"];


    this.fb.login(permissions)
      .then(function (response) {
        loader.present().then(() => {
          let userId = response.authResponse.userID;
          let params = new Array<string>();
          env.isFbLoggedIn = true;
          //Getting name and gender properties
          env.fb.api("/me?fields=name,gender", params)
            .then(function (user) {
              user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
              //now we have the users info, let's save it in the NativeStorage
              env.nativeStorage.setItem('fbUser',
                {
                  name: user.name,
                  gender: user.gender,
                  picture: user.picture,
                  id: userId
                })
                .then(function () {
                  console.log("Data Saved", userId);
                  console.log("Database Setup Start");
                  loader.setContent("Analysing data. Please Wait...");

                  env.facebookService.mostLikedPhotos(true).then((data) => {
                    console.log("Database Setup Finished");
                    loader.dismiss();
                    env.navCtrl.push(FacebookProfilePage);
                  }).catch(() => loader.dismiss());
                }).catch(() => {
                  env.infoToast();
                  env.facebookService.doFbLogout();
                });
            }).catch((ex) => {
              loader.dismiss();
              env.infoToast();
              env.facebookService.doFbLogout();
            });
        }).catch(() => {
          env.infoToast();
          env.facebookService.doFbLogout();
        });
      }).catch((e) => {
        loader.dismiss();
        env.infoToast();

        env.facebookService.doFbLogout();
        console.log(e);
      });
  }


  facebookReports() {
    if (localStorage.getItem("online") == "false") {
      this.presentToast();
      return;
    }
    this.navCtrl.push(FacebookProfilePage);
  }

  inAppBrowserOpen(i) {
    if (localStorage.getItem("online") == "false") {
      this.presentToast();
      return;
    }
    let urlCreate = "https://m.facebook.com/reg/?cid=103&refid=8&refsrc=https%3A%2F%2Fm.facebook.com%2F&_rdr"
    let urlPassword = "https://m.facebook.com/login/identify/?ctx=recover&c=https%3A%2F%2Fm.facebook.com%2Flogin%2F&lwv=101&_rdr";
    let browser;
    if (i == 1) {
      browser = this.iab.create(urlCreate);
    }
    if (i == 2) {
      browser = this.iab.create(urlPassword);
    }

  }

}
