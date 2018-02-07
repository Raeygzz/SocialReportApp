import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Instagram } from "ng2-cordova-oauth/core";
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoadingController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { InstagramService } from '../../providers/instagram-service';
import { ProfilePage } from '../profile/profile';
import { ToastController } from 'ionic-angular';
import { SqliteService } from '../../providers/sqlite';

@IonicPage()
@Component({
  selector: 'page-instagram-home',
  templateUrl: 'instagram-home.html',
})
export class InstagramHomePage {

  private oauth: OauthCordova = new OauthCordova();

  private instagramProvider: Instagram = new Instagram({

    clientId: "57aa1d756d1f45e4ad7aaa0085ad5ce4",
    // clientId: "Your Instagram App ID",
    redirectUri: 'http://localhost',
    responseType: 'token',
    appScope: ['basic']

  });

  inToken: any;
  isLoggedIn: boolean = false;
  pageReady: boolean = false;

  constructor(
    public navCtrl: NavController,
    public UserService: UserService,
    public loading: LoadingController,
    private nativeStorage: NativeStorage,
    private instagramService: InstagramService,
    public toastCtrl: ToastController,
    public sqliteService: SqliteService
  ) {

  }

  ionViewWillEnter() {
    this.isLoggedIn = false;
    // let db = this.sqliteService.getDbInstance();
    let loader = this.loading.create({
      content: 'Loading..',
    });

    this.nativeStorage.getItem("inToken")
      .then(
      data => {
        loader.present().then(() => {
          loader.dismiss();
          // db.executeSql('Select * from InstagramPhotos', [])
          // .then((data) => {
          //   if (data.rows.length > 0) {
              this.isLoggedIn = true;
              this.pageReady = true;
          //   }
          // });
        }).catch(() => {
          
        });
      }).catch((ex) => {
        loader.dismiss();
        this.pageReady = true;
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

  instagramLogin() {
    if (localStorage.getItem("online") == "false") {
      this.presentToast();
      return;
    }

    let loader = this.loading.create({
      content: 'Loading..',
    });
    let env = this;
    env.oauth.logInVia(this.instagramProvider).then((success) => {
      loader.present().then(() => {
        env.nativeStorage.setItem("inToken", success)
          .then(
          () => {
            loader.setContent("Analysing data. Please Wait...");
            env.instagramService.likesYouMost(true).then((data) => {
              console.log("Database Filled");
              loader.dismiss();
              env.navCtrl.push(ProfilePage);
            }).catch(() => {
              loader.dismiss();
              console.log("Database Filled Failed");
            });

          },
          error => loader.dismiss()
          ).catch(() => {
            env.errorToast();
            loader.dismiss();
          });
      }).catch(() => {
        env.errorToast();
        loader.dismiss();
      });
    }, (error) => {
      env.errorToast();
    }).catch(()=>{
      env.errorToast();
    });
  }

  instagramReports() {
    if (localStorage.getItem("online") == "false") {
      this.presentToast();
      return;
    }
    this.navCtrl.push(ProfilePage);
  }

  errorToast() {
    let toast = this.toastCtrl.create({
      message: 'Connection Failed',
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

}
