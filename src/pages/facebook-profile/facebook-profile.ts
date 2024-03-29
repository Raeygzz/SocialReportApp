import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ActionSheetController, ModalController} from 'ionic-angular';
import {Facebook} from '@ionic-native/facebook';
import {NativeStorage} from '@ionic-native/native-storage';
import {TabsPage} from '../tabs/tabs';
import {MostLikedPhotoFbPage} from '../most-liked-photo-fb/most-liked-photo-fb';
import {LikesMeMostFbPage} from '../likes-me-most-fb/likes-me-most-fb';
import {LoadingController} from 'ionic-angular';
import {UserService} from '../../providers/user-service';
import {WhoViewedProfileFbPage} from '../who-viewed-profile-fb/who-viewed-profile-fb';
import {HeartReactPage} from '../heart-react/heart-react';
import {LaughReactPage} from '../laugh-react/laugh-react';
import {InAppPurchasePage} from '../in-app-purchase/in-app-purchase';
import {ToastController} from 'ionic-angular';
import {FacebookService} from '../../providers/facebook-service';
import {SqliteService} from '../../providers/sqlite';
import {LocalNotifications} from '@ionic-native/local-notifications';
import {FacebookHackersPage} from '../facebook-hackers/facebook-hackers';
import {InAppPurchaseFbPhotosPage} from '../in-app-purchase-fb-photos/in-app-purchase-fb-photos';
import {InAppPurchaseFbLikersPage} from '../in-app-purchase-fb-likers/in-app-purchase-fb-likers';
import {InAppPurchaseFbLovePage} from '../in-app-purchase-fb-love/in-app-purchase-fb-love';
import {InAppPurchaseFbLaughPage} from '../in-app-purchase-fb-laugh/in-app-purchase-fb-laugh';
import {InAppPurchaseFbCrushPage} from '../in-app-purchase-fb-crush/in-app-purchase-fb-crush';

@IonicPage()
@Component({selector: 'page-facebook-profile', templateUrl: 'facebook-profile.html'})
export class FacebookProfilePage {

  user : any;
  userReady : boolean = false;
  mediaInfoArray : any = [];
  id : any;
  likers : any = [];
  fnName : String = "mostLiked";
  name : String = null;
  url : String = './assets/imgs/no-image.jpeg';
  urlPhoto : String = localStorage.getItem("photosArrayFbTemp") != null ? (JSON.parse(localStorage.getItem("photosArrayFbTemp")).length > 0
    ? JSON.parse(localStorage.getItem("photosArrayFbTemp"))[0].source
    : './assets/imgs/1.jpeg'):'./assets/imgs/1.jpeg' ;
  urlViewer : String = localStorage.getItem("likersArrayFbTemp") != null ? (JSON.parse(localStorage.getItem("likersArrayFbTemp")).length > 3
    ? JSON.parse(localStorage.getItem("likersArrayFbTemp"))[3].picture
    : './assets/imgs/2.jpeg'): './assets/imgs/2.jpeg';
  urlLiker : String = localStorage.getItem("likersArrayFbTemp") != null ? (JSON.parse(localStorage.getItem("likersArrayFbTemp")).length > 0
    ? JSON.parse(localStorage.getItem("likersArrayFbTemp"))[0].picture
    : './assets/imgs/3.jpeg'): './assets/imgs/3.jpeg';
  urlLove : String = localStorage.getItem("likersArrayFbTemp") != null ? (JSON.parse(localStorage.getItem("likersArrayFbTemp")).length > 1
    ? JSON.parse(localStorage.getItem("likersArrayFbTemp"))[1].picture
    : './assets/imgs/4.jpeg') : './assets/imgs/4.jpeg';
  urlLaugh : String = localStorage.getItem("likersArrayFbTemp") != null ? (JSON.parse(localStorage.getItem("likersArrayFbTemp")).length > 2
    ? JSON.parse(localStorage.getItem("likersArrayFbTemp"))[2].picture
    : './assets/imgs/5.jpeg') : './assets/imgs/5.jpeg';
  urlHacker : String = localStorage.getItem("likersArrayFbTemp") != null ? (JSON.parse(localStorage.getItem("likersArrayFbTemp")).length > 4
    ? JSON.parse(localStorage.getItem("likersArrayFbTemp"))[4].picture
    : './assets/imgs/6.jpeg'): './assets/imgs/6.jpeg';
    
  // whoViewedYourProfileFbCount : number = 0;
  whoViewedYourProfileFbCount : number = 1;   //edited
  whoViewedYourProfileFbBadge : boolean = true;
  // whoHackedYourProfileFbCount : number = 0;
  whoHackedYourProfileFbCount : number = 1;    //edited
  whoHackedYourProfileFbBadge : boolean = true;
  likesMeMostFbCount : number = 0;
  likesMeMostFbBadge : boolean = true;
  lovesMeMostFbCount : number = 0;
  lovesMeMostFbBadge : boolean = true;
  mostLikedPhotoFbCount : number = 0;
  mostLikedPhotoFbBadge : boolean = true;
  laughsMeMostFbBadge : boolean = true;
  laughsMeMostFbCount : number = 0;
  placeHolder : String = "./assets/imgs/no-image.jpeg";
  placeHolder1 : String = "./assets/imgs/1.jpeg";
  placeHolder2 : String = "./assets/imgs/2.jpeg";
  placeHolder3 : String = "./assets/imgs/3.jpeg";
  placeHolder4 : String = "./assets/imgs/4.jpeg";
  placeHolder5 : String = "./assets/imgs/5.jpeg";
  placeHolder6 : String = "./assets/imgs/6.jpeg";


  constructor(public navCtrl : NavController, public navParams : NavParams, public fb : Facebook, public nativeStorage : NativeStorage, public loading : LoadingController, public userService : UserService, public actionSheetCtrl : ActionSheetController, public modalCtrl : ModalController, public toastCtrl : ToastController, public facebookService : FacebookService, public sqliteService : SqliteService, public localNotifications : LocalNotifications, public localNotifications2 : LocalNotifications) {
  }
  
  ionViewWillEnter() {
    
    let loader = this.loading.create({
      content: 'Loading..',
      duration: 3000
    });

    loader.present().then(() => {     //edited

    this.badgeCounterLikers();
    this.badgeCounterPhotos();
    this.badgeCounterViewers();
    this.badgeCounterHackers();
    this.badgeCounterLoveReacters();
    this.badgeCounterLaughReacters();

  }).catch(()=> {

  });
    var vm = this;
    this
      .nativeStorage
      .getItem('fbUser')
      .then((data) => {
        vm.user = {
          name: data.name,
          gender: data.gender,
          picture: data.picture
        };
        vm.userReady = true;
        vm.id = data.id;
        vm.name = data.name;
        vm.url = data.picture;
      })
      .catch((ex) => {
        vm.doFbLogout();
      });

    let badge;
    badge = setInterval(() => {
      this.apiCall();
    }, 900000);

    vm.notifier();
    vm.notifierHackers();

    let notify;
    let timer = 60000;
    // let timer = 30000;
    notify = setInterval(() => {
      this.facebookViewers();
      this.facebookHackers();
      this.notificationChecker();
      timer += 10000;    
    }, timer);
  }

  notificationChecker() {
    this.badgeCounterLikers();
    this.badgeCounterPhotos();
    this.badgeCounterViewers();
    this.badgeCounterHackers();
    this.badgeCounterLoveReacters();
    this.badgeCounterLaughReacters();
  }

  notifier() {
    let timer = this.getRandomInt(0, 4500000);
    let vm = this;
    let viewer;

    let viewerFunctionRandom = function (timer) {
      viewer = setInterval(() => {
        let tempArray = JSON.parse(localStorage.getItem("todaysViewers"));
        if (tempArray.length > 0) 
          tempArray.shift();
        localStorage.setItem("todaysViewers", JSON.stringify(tempArray));
        clearInterval(viewer);

        if (tempArray.length > 0) {
          viewerFunctionRandom(vm.getRandomInt(0, 5000000));
        } else {
          clearInterval(viewer);
        }
        if (localStorage.getItem("todaysViewers")) 
          vm.viewersDbInsert();

        }
      , timer);
    }

    if (JSON.parse(localStorage.getItem("todaysViewers")) != null) {
      if (JSON.parse(localStorage.getItem("todaysViewers")).length > 0) 
        viewerFunctionRandom(timer);
      }
    
  }

  notifierHackers() {
    let timer = this.getRandomInt(0, 4000000);
    let vm = this;
    let hacker;

    let hackerFunctionRandom = function (timer) {
      hacker = setInterval(() => {
        let tempArray = JSON.parse(localStorage.getItem("todaysHackers"));
        if (tempArray.length > 0)
          tempArray.shift();
        localStorage.setItem("todaysHackers", JSON.stringify(tempArray));
        clearInterval(hacker);

        if (tempArray.length > 0) {
          hackerFunctionRandom(vm.getRandomInt(0, 3500000));
        } else {
          clearInterval(hacker);
        }
        if (localStorage.getItem("todaysHackers")) 
          vm.viewersDbInsert();

        }
      , timer);
    }

    if (JSON.parse(localStorage.getItem("todaysHackers")) != null) {
      if (JSON.parse(localStorage.getItem("todaysHackers")).length > 0) 
        hackerFunctionRandom(timer);
      }
    
  }

  badgeCounterPhotos() {
    let db = this
      .sqliteService
      .getDbInstance();
    db
      .executeSql('SELECT Distinct(id) as badgeCount FROM FacebookPhotos where viewFlag=?', [0])
      .then((data) => {
        this.mostLikedPhotoFbCount = data.rows.length;
        if (this.mostLikedPhotoFbCount > 0) {
          this.mostLikedPhotoFbBadge = true;
          if (this.urlPhoto == this.placeHolder1) 
            this.dbPhotoUrl();
          }
        else {
          this.mostLikedPhotoFbCount = 5;
        }
        }
      )
      .catch((e) => {});
  }

  badgeCounterLikers() {
    let db = this
      .sqliteService
      .getDbInstance();
    db
      .executeSql('SELECT COUNT(id) as user_count FROM FacebookLikers where  viewFlag=? and type!=?' +
        ' and type!=? GROUP BY name',
    [0, 'LOVE', 'HAHA'])
      .then((data) => {
        this.likesMeMostFbCount = data.rows.length;
        if (this.likesMeMostFbCount > 0) {
          this.likesMeMostFbBadge = true;
          if (this.urlLiker == this.placeHolder3) 
            this.dbLikerUrl();
          }
        else 
          this.likesMeMostFbCount = 5;
        }
      )
      .catch((e) => {});
  }

  badgeCounterLoveReacters() {
    let db = this
      .sqliteService
      .getDbInstance();
    db
      .executeSql('SELECT COUNT(id) as user_count FROM FacebookLikers where  viewFlag=? and type=? ' +
        'GROUP BY name',
    [0, 'LOVE'])
      .then((data) => {
        this.lovesMeMostFbCount = data.rows.length;
        if (this.lovesMeMostFbCount > 0) {
          this.lovesMeMostFbBadge = true;
          if (this.urlLove == this.placeHolder4) {
            this.dbLoveUrl();
          }
        } else 
          this.lovesMeMostFbCount = 5;
        }
      )
      .catch((e) => {});
  }

  badgeCounterLaughReacters() {
    let db = this
      .sqliteService
      .getDbInstance();
    db
      .executeSql('SELECT COUNT(id) as user_count FROM FacebookLikers where  viewFlag=? and type=? ' +
        'GROUP BY name',
    [0, 'HAHA'])
      .then((data) => {
        this.laughsMeMostFbCount = data.rows.length;
        if (this.laughsMeMostFbCount > 0) {
          this.laughsMeMostFbBadge = true;
          if (this.urlLaugh == this.placeHolder5) 
            this.dbLaughUrl();
          }
        else 
          this.laughsMeMostFbCount = 5;
        }
      )
      .catch((e) => {});
  }

  badgeCounterViewers() {
    let db = this
      .sqliteService
      .getDbInstance();
    db
    // .executeSql('SELECT * FROM FacebookViewers where  viewFlag=? GROUP BY name', [0])
    .executeSql('SELECT COUNT(id) as user_count FROM FacebookViewers where viewFlag=? GROUP BY name', [0])     //edited
    .then((data) => {
        this.whoViewedYourProfileFbCount = data.rows.length;
        if (this.whoViewedYourProfileFbCount > 0) {
          this.whoViewedYourProfileFbBadge = true;
          if (this.urlViewer == this.placeHolder2) 
            this.dbViewerUrl();
          }
        else 
          this.whoViewedYourProfileFbCount = 5;
        }
      )
      .catch((e) => {});
  }

  badgeCounterHackers() {
    let db = this
      .sqliteService
      .getDbInstance();
    db
    // .executeSql('SELECT * FROM FacebookHackers where  viewFlag=? GROUP BY name', [0])
    .executeSql('SELECT COUNT(id) as user_count FROM FacebookHackers where viewFlag=? GROUP BY name', [0])    //edited
    .then((data) => {
        this.whoHackedYourProfileFbCount = data.rows.length;
        if (this.whoHackedYourProfileFbCount > 0) {
          this.whoHackedYourProfileFbBadge = true;
          if (this.urlHacker == this.placeHolder6) {
            this.dbHackerUrl();
          }
        } 
        else 
          this.whoHackedYourProfileFbCount = 5;
        }
      )
      .catch((e) => {});
  }

  presentToast() {
    let toast = this
      .toastCtrl
      .create({message: 'No Internet Connection', duration: 3000, position: 'bottom'});

    toast.present();
  }

  errorToast(error) {
    let toast = this
      .toastCtrl
      .create({message: error, duration: 3000, position: 'bottom'});

    toast.present();
  }

  apiCall() {
    let env = this;
    let db = env
      .sqliteService
      .getDbInstance();
    db
      .executeSql('Select * FROM FacebookPhotos', {})
      .then((data) => {
        if (data.rows.length > 0) {
          this
            .facebookService
            .mostLikedPhotos(false);
        } else {
          env
            .facebookService
            .mostLikedPhotos(true);
        }
      })
      .catch(() => {});
  }

  dbPhotos() {
    if (localStorage.getItem("online") == "false") {
      this.presentToast();
      return;
    }
    let db = this
      .sqliteService
      .getDbInstance();
    let env = this;
    let loader = this
      .loading
      .create({content: 'Un Momento. Generando tu reporte', duration: 3000});
    this
      .nativeStorage
      .getItem('prod_fb_photos')
      .then(data => {
        loader
          .present()
          .then(() => {
            db
              .executeSql('Select FacebookPhotos.id, FacebookPhotos.source, count(FacebookLikers.id) as lik' +
                'esCount from FacebookPhotos LEFT JOIN FacebookLikers ON FacebookPhotos.id = Face' +
                'bookLikers.image_id Group By FacebookLikers.image_id ORDER BY likesCount DESC', {})
              .then((data) => {
                let dataArray = [];
                if (data.rows.length > 0) {
                  for (let i = 0; i < data.rows.length; i++) {
                    dataArray.push(data.rows.item(i));
                  }
                }
                // loader.dismiss();
                env
                  .navCtrl
                  .push(MostLikedPhotoFbPage, {mostLikedPhotosArray: dataArray});
              })
              .catch(e => {
                loader.dismiss();
                this.errorToast("Please try again later!");
              });
          })
          .catch(() => {
            loader.dismiss();
            this.errorToast("Please try again later!");
          });
      }, error => {
        this.presentModal(InAppPurchaseFbPhotosPage);
      })
      .catch(() => {
        loader.dismiss();
        this.errorToast("Please try again later!");
      });

  }

  dbPhotoUrl() {
    let db = this
      .sqliteService
      .getDbInstance();
    let env = this;

    db
      .executeSql('Select FacebookPhotos.id, FacebookPhotos.source, count(FacebookLikers.id) as lik' +
        'esCount from FacebookPhotos LEFT JOIN FacebookLikers ON FacebookPhotos.id = Face' +
        'bookLikers.image_id Group By FacebookLikers.image_id ORDER BY likesCount DESC Li' +
        'mit 1', {})
      .then((data) => {
        if (data.rows.length > 0) {
          let obj = data
            .rows
            .item(0);
          env.urlPhoto = obj.source;
        } else {
          env.urlPhoto = env.placeHolder1;
        }
      })
      .catch(e => {
        env.urlPhoto = env.placeHolder1;
      });
  }

  dbLikers() {
    if (localStorage.getItem("online") == "false") {
      this.presentToast();
      return;
    }

    let db = this
      .sqliteService
      .getDbInstance();
    let env = this;
    
    let loader = this
      .loading
      .create({content: 'Un Momento. Generando tu reporte', duration: 3000});
    this
      .nativeStorage
      .getItem('prod_fb_likers')
      .then(data => {
        loader
          .present()
          .then(() => {
            db
              .executeSql('SELECT COUNT(id) as user_count, name, picture FROM FacebookLikers where type != ' +
                '? GROUP BY name ORDER BY user_count DESC',
            ['LOVE'])
              .then((data) => {
                let dataArray = [];
                if (data.rows.length > 0) {
                  for (let i = 0; i < data.rows.length; i++) {
                    dataArray.push(data.rows.item(i));
                  }
                }
                // loader.dismiss();
                env
                  .navCtrl
                  .push(LikesMeMostFbPage, {likers: dataArray});
              })
              .catch(e => {
                loader.dismiss();
                this.errorToast("Please try again later!");
              });
          })
          .catch(() => {
            loader.dismiss();
            this.errorToast("Please try again later!");
          });
      }, error => {
        this.presentModal(InAppPurchaseFbLikersPage);
      });
  }

  dbLikerUrl() {
    let db = this
      .sqliteService
      .getDbInstance();
    let env = this;

    db
      .executeSql('SELECT COUNT(id) as user_count, name, picture FROM FacebookLikers where type != ' +
        '? GROUP BY name ORDER BY user_count DESC Limit 1',
    ['LOVE'])
      .then((data) => {
        if (data.rows.length > 0) {
          let obj = data
            .rows
            .item(0);
          env.urlLiker = obj.picture;
        } else {
          env.urlLiker = env.placeHolder3;
        }
      })
      .catch((e) => {
        env.urlLiker = env.placeHolder3;
      })
  }

  dbLoveReacters() {
    if (localStorage.getItem("online") == "false") {
      this.presentToast();
      return;
    }
    
    let db = this
      .sqliteService
      .getDbInstance();

    let env = this;

    let loader = this
      .loading
      .create({content: 'Un Momento. Generando tu reporte', duration: 3000});
      
    this
      .nativeStorage
      .getItem('prod_fb_lovers')
      .then(data => {
  
        loader
          .present()
          .then(() => {
            db
              .executeSql('SELECT COUNT(id) as user_count, name, picture FROM FacebookLikers where type = ?' +
                ' GROUP BY name ORDER BY user_count DESC',
            ['LOVE'])
              .then((data) => {
                let dataArray = [];
                if (data.rows.length > 0) {
                  for (let i = 0; i < data.rows.length; i++) {
                    dataArray.push(data.rows.item(i));
                  }
                }
                // loader.dismiss();
                env
                  .navCtrl
                  .push(HeartReactPage, {likers: dataArray});
              })
              .catch(e => {
                loader.dismiss();
                this.errorToast("Please try again later!");
              });
          })
          .catch(() => {
            loader.dismiss();
            this.errorToast("Please try again later!");
          });
      }, error => {
        this.presentModal(InAppPurchaseFbLovePage);
      });
  }

  dbLoveUrl() {
    let db = this
      .sqliteService
      .getDbInstance();
    let env = this;

    db
      .executeSql('SELECT COUNT(id) as user_count, name, picture FROM FacebookLikers where type = ?' +
        ' GROUP BY name ORDER BY user_count DESC Limit 1',
    ['LOVE'])
      .then((data) => {
        if (data.rows.length > 0) {
          let obj = data
            .rows
            .item(0);
          env.urlLove = obj.picture;
        } else {
          env.urlLove = env.placeHolder4;
        }
      })
      .catch((e) => {
        env.urlLiker = env.placeHolder4;
      })
  }

  dbLaughReacters() {
    if (localStorage.getItem("online") == "false") {
      this.presentToast();
      return;
    }
    let db = this
      .sqliteService
      .getDbInstance();
    let env = this;
    let loader = this
      .loading
      .create({content: 'Un Momento. Generando tu reporte', duration: 3000});
    this
      .nativeStorage
      .getItem('prod_fb_laugh')
      .then(data => {
        loader
          .present()
          .then(() => {
            db
              .executeSql('SELECT COUNT(id) as user_count, name, picture FROM FacebookLikers where type = ?' +
                ' GROUP BY name ORDER BY user_count DESC',
            ['HAHA'])
              .then((data) => {
                let dataArray = [];
                if (data.rows.length > 0) {
                  for (let i = 0; i < data.rows.length; i++) {
                    dataArray.push(data.rows.item(i));
                  }
                }
                // loader.dismiss();
                env
                  .navCtrl
                  .push(LaughReactPage, {likers: dataArray});
              })
              .catch(e => {
                loader.dismiss();
                this.errorToast("Please try again later!");
              });
          })
          .catch(() => {
            loader.dismiss();
            this.errorToast("Please try again later!");
          });
      }, error => {
        this.presentModal(InAppPurchaseFbLaughPage);
      });

  }

  dbLaughUrl() {
    let db = this
      .sqliteService
      .getDbInstance();
    let env = this;

    db
      .executeSql('SELECT COUNT(id) as user_count, name, picture FROM FacebookLikers where type = ?' +
        ' GROUP BY name ORDER BY user_count DESC Limit 1',
    ['HAHA'])
      .then((data) => {
        if (data.rows.length > 0) {
          let obj = data
            .rows
            .item(0);
          env.urlLaugh = obj.picture;
        } else {
          env.urlLaugh = env.placeHolder5;
        }
      })
      .catch((e) => {
        env.urlLaugh = env.placeHolder5;
      })
  }

  dbHackerUrl() {
    let db = this
      .sqliteService
      .getDbInstance();
    let env = this;

    db
      .executeSql('Select * from FacebookHackers order by date DESC Limit 1', [])
      .then((data) => {
        if (data.rows.length > 0) {
          let obj = data
            .rows
            .item(0);
          env.urlHacker = obj.picture;
          console.log('env this', obj.picture);
        } else {
          env.urlHacker = env.placeHolder6;
        }
      })
      .catch((e) => {
        env.urlHacker = env.placeHolder6;
      })
  }

  dbViewerUrl() {
    let db = this
      .sqliteService
      .getDbInstance();
    let env = this;

    db
      .executeSql('Select * from FacebookViewers order by date DESC Limit 1', [])
      .then((data) => {
        if (data.rows.length > 0) {
          let obj = data
            .rows
            .item(0);
          env.urlViewer = obj.picture;
        } else {
          env.urlViewer = env.placeHolder2;
        }
      })
      .catch((e) => {
        env.urlViewer = env.placeHolder2;
      })
  }

  mostLikedPhotos() {
    if (localStorage.getItem("online") == "false") {
      this.presentToast();
      return;
    }
    this.dbPhotos();
  }

  whoViewedYourProfile() {
    if (localStorage.getItem("online") == "false") {
      this.presentToast();
      return;
    }

    let loader = this       //edited
      .loading
      .create({
        content: 'Un Momento. Generando tu reporte',
        duration: 3000
      });

      loader          //edited
          .present()
          .then(() => {}).catch(()=> {});

    this
      .nativeStorage
      .getItem('whoViewedFbProfile')
      .then(data => {
        loader.dismiss();
        this.fbViewers();
      }, error => {
        loader.dismiss();
        this.presentModal(InAppPurchasePage);
      });
  }

  presentModal(Page) {
    let modal = this
      .modalCtrl
      .create(Page);
    modal.present();
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  fbViewers() {
    let db = this
      .sqliteService
      .getDbInstance();

      // let loader = this       //edited
      // .loading
      // .create({
      //   content: 'Un Momento. Generando tu reporte',
      //   duration: 3000
      // });

      // loader          //edited
      //     .present()
      //     .then(() => {}).catch(()=> {});
    db
      .executeSql('Select * from FacebookViewers', [])
      .then((data) => {
        let dataArray = [];
        if (data.rows.length > 0) {
          let length = data.rows.length;
          for (let i = 0; i < length; i++) {
            dataArray.push(data.rows.item(i));
          }
        }

        let dates = [];
        db
          .executeSql('Select distinct(date) from FacebookViewers', [])
          .then((dataDate) => {
            if (dataDate.rows.length > 0) {
              let length = dataDate.rows.length;
              for (let i = 0; i < length; i++) {
                dates.push(dataDate.rows.item(i));
              }
              this
                .navCtrl
                .push(WhoViewedProfileFbPage, {
                  likers: dataArray,
                  dates: dates
                });
            }
            else{
              this
              .navCtrl
              .push(WhoViewedProfileFbPage, {
                likers: dataArray,
                // dates: []
                dates: dates    //edited
              });
            }
          }).catch(() => {
            this.errorToast("Please try again later.");
          });

      })
      .catch(e => {
        this.errorToast("Please try again later!");
      });
  }

  facebookViewers() {
    let db = this
      .sqliteService
      .getDbInstance();
    let env = this;

    if (env.hasOneDayPassed()) {
      localStorage.removeItem("todaysViewers");
      localStorage.removeItem("viewerLengthFb");
      db
        .executeSql('SELECT COUNT(id) as user_count, id, name, picture, image_id, unique_id FROM Face' +
          'bookLikers GROUP BY name ORDER BY user_count DESC', {})
        .then((data) => {
          let dataArray = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              dataArray.push(data.rows.item(i));
            }
          }

          if (dataArray.length > 0) {
            let lengthViewers = env.getRandomInt(1, 10);

            let mySet = new Set();
            for (let i = 0; i < lengthViewers; i++) {
              mySet.add(env.getRandomInt(0, dataArray.length - 1));
              if (mySet.size < i + 1) {
                i--;
              }
            }
            let randomArray = Array.from(mySet);
            let viewers = [];
            for (let i = 0; i < randomArray.length; i++) {
              viewers.push(dataArray[randomArray[i]]);
            }

            let length = viewers.length;
            let date = new Date().toLocaleDateString();

            let viewerDataObj = [];
            for (let i = 0; i < length; i++) {

              viewerDataObj.push({
                "id": viewers[i].id,
                "name": viewers[i].name,
                "picture": viewers[i].picture,
                "image_id": viewers[i].image_id,
                "unique_id": viewers[i].unique_id,
                "viewFlag": 0,
                "date": date
              });

            }
            localStorage.setItem("viewerLengthFb", JSON.stringify(viewerDataObj.length));
            localStorage.setItem("todaysViewers", JSON.stringify(viewerDataObj));

            env.viewersDbInsert();
          }

        })
        .catch(e => {
          this.errorToast("Please try again later!");
        });
    }

  }

  viewersDbInsert() {
    let env = this;
    let db = this
      .sqliteService
      .getDbInstance();
    if (localStorage.getItem("todaysViewers") == undefined || localStorage.getItem("viewerLengthFb") == undefined) {
      return;
    }
    let viewers = JSON.parse(localStorage.getItem("todaysViewers"));
    let index = JSON.parse(localStorage.getItem("viewerLengthFb")) - JSON
      .parse(localStorage.getItem("todaysViewers"))
      .length;
    if (viewers.length == 0) 
      return;
    db
      .executeSql('Insert into FacebookViewers(id,name,picture,image_id,unique_id,viewFlag,date) va' +
        'lues(?,?,?,?,?,?,?)',
    [
      viewers[0].id,
      viewers[0].name,
      viewers[0].picture,
      viewers[0].image_id,
      viewers[0].unique_id,
      viewers[0].viewFlag,
      viewers[0].date
    ])
      .then(() => {

        let notificationArray = [];

        this
          .nativeStorage
          .getItem('whoViewedFbProfile')
          .then(data => {
            notificationArray.push({
              "id": index,
              "text": viewers[0].name + ' Acaba de ver tu perfil de Facebook',
              icon: './assets/icon/notification.png'
            });
            env.notifications(notificationArray);
            env.badgeCounterViewers();
            env.notifier();
          }, error => {
            notificationArray.push({
              "id": index,
              "text": env.nameEnc(viewers[0].name) + ' Acaba de ver tu perfil de Facebook',
              icon: './assets/icon/notification.png'
            });
            env.notifications(notificationArray);
            env.badgeCounterViewers();
            env.notifier();
          });
      })
      .catch(e => {});
  }

  nameEnc(name) {
    let encName = "";
    let arr = name.split(' ');
    let tempArray = [];
    for (let i = 0; i < arr.length; i++) {
      tempArray.push(arr[i].substring(0, arr[i].length - 2).replace(/\S/gi, '*') + arr[i].substring(arr[i].length - 2, arr[i].length));
    }
    for (let i = 0; i < tempArray.length; i++) {
      encName += tempArray[i] + ' ';
    }
    return encName.slice(0, -1);
  }

  notifications(array) {
    this
      .localNotifications
      .schedule(array);
    this.notificationChecker();
  }

  notifications2(array) {
    this
      .localNotifications2
      .schedule(array);
    this.notificationChecker();
  }

  fbHackers() {
    if (localStorage.getItem("online") == "false") {
      this.presentToast();
      return;
    }
    let db = this
      .sqliteService
      .getDbInstance();

      let loader = this // edited
      .loading
      .create({content: 'Un Momento. Generando tu reporte', duration: 3000});

    this
      .nativeStorage
      .getItem('prod_fb_crush')
      .then(data => {
        loader
          .present()
          .then(() => {}).catch(()=> {});
        db
          .executeSql('Select * from FacebookHackers', [])
          .then((data) => {
            let dataArray = [];
            if (data.rows.length > 0) {
              let length = data.rows.length;
              for (let i = 0; i < length; i++) {
                dataArray.push(data.rows.item(i));
              }
            }
            loader.dismiss();     //edited
            let dates = [];
            db
              .executeSql('Select distinct(date) from FacebookHackers', [])
              .then((dataDate) => {
                if (dataDate.rows.length > 0) {
                  let length = dataDate.rows.length;
                  for (let i = 0; i < length; i++) {
                    dates.push(dataDate.rows.item(i));
                  }
                  
                  this
                    .navCtrl
                    .push(FacebookHackersPage, {
                      likers: dataArray,
                      dates: dates
                    });
                } else {
                  this
                    .navCtrl
                    .push(FacebookHackersPage, {
                      // likers: [],
                      likers: dataArray,  //edited 30-april
                      dates: []
                    });
                }
              }).catch(() => {
                loader.dismiss();
                this.errorToast("Please try again later!");
              });

          })
          .catch(e => {
            loader.dismiss();
            this.errorToast("Please try again later!");
          });
      }, error => {
        this.presentModal(InAppPurchaseFbCrushPage);
      });
  }

  facebookHackers() {
    let db = this
      .sqliteService
      .getDbInstance();
    let env = this;

    if (env.hasOneDayPassedHackers()) {
      localStorage.removeItem("todaysHackers");
      localStorage.removeItem("hackerLengthFb");
      db
        .executeSql('SELECT COUNT(id) as user_count, id, name, picture, image_id, unique_id FROM Face' +
          'bookLikers GROUP BY name ORDER BY user_count DESC', {})
        .then((data) => {
          let dataArray = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              dataArray.push(data.rows.item(i));
            }
          }

          if (dataArray.length > 0) {
            let lengthHackers = env.getRandomInt(1, 5);

            let mySet = new Set();
            for (let i = 0; i < lengthHackers; i++) {
              mySet.add(env.getRandomInt(0, dataArray.length - 1));
              if (mySet.size < i + 1) {
                i--;
              }
            }
            let randomArray = Array.from(mySet);
            let hackers = [];
            for (let i = 0; i < randomArray.length; i++) {
              hackers.push(dataArray[randomArray[i]]);
            }

            let length = hackers.length;
            let date = new Date().toLocaleDateString();

            let hackerDataObj = [];
            for (let i = 0; i < length; i++) {

              hackerDataObj.push({
                "id": hackers[i].id,
                "name": hackers[i].name,
                "picture": hackers[i].picture,
                "image_id": hackers[i].image_id,
                "unique_id": hackers[i].unique_id,
                "viewFlag": 0,
                "date": date
              });

            }
            localStorage.setItem("hackerLengthFb", JSON.stringify(hackerDataObj.length));
            localStorage.setItem("todaysHackers", JSON.stringify(hackerDataObj));

            env.hackersDbInsert();
          }

        })
        .catch(e => {});
    }

  }

  hackersDbInsert() {
    let env = this;
    let db = this
      .sqliteService
      .getDbInstance();
    if (localStorage.getItem("todaysHackers") == undefined || localStorage.getItem("hackerLengthFb") == undefined) {
      return;
    }
    let hackers = JSON.parse(localStorage.getItem("todaysHackers"));
    let index = JSON.parse(localStorage.getItem("hackerLengthFb")) - JSON
      .parse(localStorage.getItem("todaysHackers"))
      .length;
    if (hackers.length == 0) 
      return;
    db
      .executeSql('Insert into FacebookHackers(id,name,picture,image_id,unique_id,viewFlag,date) va' +
        'lues(?,?,?,?,?,?,?)',
    [
      hackers[0].id,
      hackers[0].name,
      hackers[0].picture,
      hackers[0].image_id,
      hackers[0].unique_id,
      hackers[0].viewFlag,
      hackers[0].date
    ])
      .then(() => {

        let notificationArray = [];

        this
          .nativeStorage
          .getItem('prod_fb_crush')
          .then(data => {
            notificationArray.push({
              "id": index,
              "text": hackers[0].name + '  es tu fan de la semana',
              icon: './assets/icon/notification.png'
            });
            env.notifications2(notificationArray);
            env.badgeCounterHackers();
            env.notifierHackers();
          }, error => {
            notificationArray.push({
              "id": index,
              "text": env.nameEnc(hackers[0].name) + '  es tu fan de la semana',
              icon: './assets/icon/notification.png'
            });
            env.notifications2(notificationArray);
            env.badgeCounterHackers();
            env.notifierHackers();
          });
      })
      .catch(e => {});
  }

  hasOneDayPassed() {
    let date = new Date().toLocaleDateString();

    if (localStorage.getItem("todays_date") == date) {
      return false;
    } else {
      localStorage.setItem("todays_date", date);
      return true;
    }
  }

  hasOneDayPassedHackers() {
    let date = new Date().toLocaleDateString();

    if (localStorage.getItem("todays_date_hackers") == date) {
      return false;
    } else {
      localStorage.setItem("todays_date_hackers", date);
      return true;
    }
  }

  doFbLogout() {
    let env = this;
    this
      .fb
      .logout()
      .then(function (response) {
        localStorage.removeItem("todays_date");
        localStorage.removeItem("todays_date_hackers");
        localStorage.removeItem("todaysViewers");
        localStorage.removeItem("viewerLengthFb");
        localStorage.removeItem("todaysHackers");
        localStorage.removeItem("hackerLengthFb");
        localStorage.removeItem("photosArrayFbTemp");
        localStorage.removeItem("likersArrayFbTemp");
        env
          .nativeStorage
          .remove('fbUser')
          .then(() => {
            let db = env
              .sqliteService
              .getDbInstance();
            db
              .executeSql('Delete FROM FacebookLikers', {})
              .then((data) => {});
            db
              .executeSql('Delete FROM FacebookPhotos', {})
              .then((data) => {});
            db
              .executeSql('Delete FROM FacebookViewers', {})
              .then((data) => {});
            db
              .executeSql('Delete FROM FacebookHackers', {})
              .then((data) => {});
            env
              .navCtrl
              .popAll()
              .then(function (data) {
                env
                  .navCtrl
                  .setRoot(TabsPage, {"tab": "facebook"})
                  .catch(() => {});
              })
              .catch(() => {});
          }, error => {});
      }, function (error) {});
  }

  presentActionSheet() {
    let actionSheet = this
      .actionSheetCtrl
      .create({
        title: 'Ajustes',
        buttons: [
          {
            text: 'Cerras Sesión',
            role: 'destructive',
            handler: () => {
              this.doFbLogout();
            }
          }, {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              actionSheet.dismiss().then(()=> {}).catch(()=> {

              });
              return false;
            }
          }]
      });
    actionSheet.present();
  }

  errorHandler(event) {
    if (event) 
      event.target.src = "./assets/imgs/no-image.jpeg";
    }
}
