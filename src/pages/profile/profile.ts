import { Component } from '@angular/core';
import { IonicPage, NavController, ActionSheetController, ModalController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { UserService } from '../../providers/user-service';
import { TabsPage } from '../tabs/tabs';
import { YourLikersPage } from '../your-likers/your-likers';
import { MyLikesPage } from '../my-likes/my-likes';
import { WhoViewedProfileInPage } from '../who-viewed-profile-in/who-viewed-profile-in';
import { InAppPurchaseInstagramPage } from '../in-app-purchase-instagram/in-app-purchase-instagram';
import { ToastController } from 'ionic-angular';
import { InstagramService } from '../../providers/instagram-service';
import { SqliteService } from '../../providers/sqlite';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { InstagramHackersPage } from '../instagram-hackers/instagram-hackers';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  token: any;
  userReady: boolean = false;
  followerList: any;
  mediaInfoArray: any = [];
  loader: any;
  name: string = null;
  url: string = null;
  youLikeMostCount:number = 0;
  youLikeMostBadge:boolean = false;
  likesYouMostCount:number = 0;
  likesYouMostBadge:boolean = false;
  whoViewedYourProfileCount:number = 0;
  whoViewedYourProfileBadge:boolean = false;
  whoHackedYourProfileFbCount: number = 0;
  whoHackedYourProfileFbBadge: boolean = false;
  placeHolder:String = "../../assets/imgs/no-image.jpeg";

  constructor(
    public navCtrl: NavController, 
    public UserService: UserService, 
    public loading: LoadingController, 
    private nativeStorage: NativeStorage, 
    public actionSheetCtrl: ActionSheetController, 
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private instagramService: InstagramService,
    public sqliteService: SqliteService,
    public localNotifications: LocalNotifications,
    public localNotifications2: LocalNotifications
  ) {
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'No Internet Connection',
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  ionViewWillEnter(){
    let vm = this;
    this.instagramViewers();
    this.instagramHackers();
    this.badgeCounterLikers();
    this.badgeCounterPhotos();
    this.badgeCounterViewers();
    this.badgeCounterHackers();

    this.nativeStorage.getItem("inToken")
    .then(
      data => {
        this.token = data;
        this.UserService.verifyToken(data)
        .then((response: any) => {
          this.name = response.data.full_name;
          this.url = response.data.profile_picture;
          this.userReady = true;
        });
      },
      error => {
        // this.navCtrl.setRoot(TabsPage,{
        //   "tab":"instagram"
        // });
        vm.logout();
      }
    ).catch(()=>{
      // vm.logout();
    });

    // this.apiCall();
    let badge;
    badge = setInterval(() => {
      this.apiCall();
    },1000000);

    let notify;
    let timer = 10000;
    notify = setInterval(() => {
      this.checkHacker();
      this.checkViewer();
      this.instagramViewers();
      this.instagramHackers();
      this.notificationChecker();
      timer += 30;
    },timer);

    vm.notifier();
    vm.notifierHackers();
  }

  notificationChecker(){
    this.instagramViewers();
    this.instagramHackers();
    this.badgeCounterLikers();
    this.badgeCounterPhotos();
    this.badgeCounterViewers();
    this.badgeCounterHackers();
  }

  checkViewer(){
    let env = this;
    let db = env.sqliteService.getDbInstance();
    db.executeSql('Select * FROM InstagramViewers', {})
      .then((data) => {
      if (data.rows.length == 0) {
      localStorage.removeItem("todays_date_in")
      }
    })
  }

  checkHacker(){
    let env = this;
    let db = env.sqliteService.getDbInstance();
    db.executeSql('Select * FROM InstagramHackers', {})
      .then((data) => {
      if (data.rows.length == 0) {
      localStorage.removeItem("todays_date_hackersIn")
      }
    })
  }

  notifier(){
    let timer = this.getRandomInt(0,9000000);
    let vm = this;
    // let timer = 10000;
    let viewer;
    console.log("timer initial", timer / 1000);

    let viewerFunctionRandom = function (timer) {
      viewer = setInterval(() => {
        console.log(JSON.parse(localStorage.getItem("todaysViewersIn")));
        let tempArray = JSON.parse(localStorage.getItem("todaysViewersIn"));
        if (tempArray.length > 0)
          tempArray.shift();
        console.log(tempArray);
        localStorage.setItem("todaysViewersIn", JSON.stringify(tempArray));
        clearInterval(viewer);

        if (tempArray.length > 0) {
          viewerFunctionRandom(vm.getRandomInt(0,8000000));
          // viewerFunctionRandom(10000);
        }
        else {
          clearInterval(viewer);
        }
        if (localStorage.getItem("todaysViewersIn"))
          vm.viewersDbInsert();
      }, timer);
    }

    if(JSON.parse(localStorage.getItem("todaysViewersIn")) != null){
    if (JSON.parse(localStorage.getItem("todaysViewersIn")).length > 0)
      viewerFunctionRandom(timer);
    }
  }

  notifierHackers() {
    let timer = this.getRandomInt(0, 5000000);
    let vm = this;
    // let timer = 10000;
    let hacker;
    console.log("timer initial", timer / 1000);

    let hackerFunctionRandom = function (timer) {
      hacker = setInterval(() => {
        console.log(JSON.parse(localStorage.getItem("todaysHackersIn")));
        let tempArray = JSON.parse(localStorage.getItem("todaysHackersIn"));
        if (tempArray.length > 0)
          tempArray.shift();
        console.log(tempArray);
        localStorage.setItem("todaysHackersIn", JSON.stringify(tempArray));
        clearInterval(hacker);

        if (tempArray.length > 0) {
          hackerFunctionRandom(vm.getRandomInt(0, 4000000));
          // viewerFunctionRandom(10000);
        }
        else {
          clearInterval(hacker);
        }
        if (localStorage.getItem("todaysHackersIn"))
          vm.hackersDbInsert();

      }, timer);
    }

    if (JSON.parse(localStorage.getItem("todaysHackersIn")) != null) {
      if (JSON.parse(localStorage.getItem("todaysHackersIn")).length > 0)
      hackerFunctionRandom(timer);
    }

  }

  apiCall(){
    let env = this;
    let db = env.sqliteService.getDbInstance();
    db.executeSql('Select * FROM InstagramPhotos', {})
      .then((data) => {
      if (data.rows.length > 0) {
      env.instagramService.likesYouMost(false);
      }
      else{
      env.instagramService.likesYouMost(true);
      }
    })
  }

  logout() {
    let env = this;
    localStorage.removeItem("todays_date_hackersIn");
    localStorage.removeItem("todaysHackersIn");
    localStorage.removeItem("hackerLengthIn");
    localStorage.removeItem("todaysViewersIn");
    localStorage.removeItem("viewerLengthIn");
    localStorage.removeItem("todays_date_in");
    env.nativeStorage.remove("inToken").then(
      () => {
        let db = env.sqliteService.getDbInstance();
        db.executeSql('Delete FROM InstagramLikers', {})
        .then((data) => {
          console.log("FacebookLikers table deleted")
        });
        db.executeSql('Delete FROM InstagramPhotos', {})
        .then((data) => {
          console.log("FacebookPhotos table deleted")
        });
        db.executeSql('Delete FROM InstagramViewers', {})
        .then((data) => {
          console.log("InstagramViewers table deleted")
        });
        db.executeSql('Delete FROM InstagramHackers', {})
        .then((data) => {
          console.log("InstagramHackers table deleted")
        });
        env.navCtrl.popAll().then(function(data){
          env.navCtrl.setRoot(TabsPage,{
            "tab":"instagram"
          }).catch(() => {

          });
        }).catch(() => {
                
        });
      },
      error => {}
    );
  }

  whoViewedYourProfile(){
    if(localStorage.getItem("online") == "false"){
      this.presentToast();
      return;
    }

    this.nativeStorage.getItem('whoViewedInstagramProfile')
    .then(
      data => {
          this.inViewers();
      },
      error => {
        // this.inViewers();
        this.presentModal();
      }
    );
  }

  badgeCounterPhotos(){
    let db = this.sqliteService.getDbInstance();
    db.executeSql('SELECT Distinct(id) as badgeCount FROM InstagramPhotos where viewFlag=?', [0])
      .then((data) => {
        console.log("InstaPhotos Count",data.rows.length);
        this.youLikeMostCount = data.rows.length;
        if(this.youLikeMostCount>0)
        this.youLikeMostBadge = true;
        else
        this.youLikeMostBadge = false;
      })
      .catch((e)=>{
        console.log(e);
      });
  }

  badgeCounterLikers(){
    let db = this.sqliteService.getDbInstance();
    db.executeSql('SELECT COUNT(id) as user_count, name, picture FROM InstagramLikers where viewFlag=? GROUP BY name', [0])
      .then((data) => {
        console.log("InstaLikers Count",data.rows.length);
        this.likesYouMostCount = data.rows.length;
        if(this.likesYouMostCount>0)
        this.likesYouMostBadge = true;
        else
        this.likesYouMostBadge = false;
      })
      .catch((e)=>{
        console.log(e);
      });
  }

  badgeCounterViewers(){
    let db = this.sqliteService.getDbInstance();
    db.executeSql('SELECT * FROM InstagramViewers where viewFlag=? GROUP BY name', [0])
      .then((data) => {
        console.log("InstagramViewers Count",data.rows.length);
        this.whoViewedYourProfileCount = data.rows.length;
        if(this.whoViewedYourProfileCount>0)
        this.whoViewedYourProfileBadge = true;
        else
        this.whoViewedYourProfileBadge = false;
      })
      .catch((e)=>{
        console.log(e);
      });
  }

  badgeCounterHackers() {
    let db = this.sqliteService.getDbInstance();
    db.executeSql('SELECT * FROM InstagramHackers where  viewFlag=? GROUP BY name', [0])
      .then((data) => {
        console.log("FacebookViewers Count", data.rows.length);
        this.whoHackedYourProfileFbCount = data.rows.length;
        if (this.whoHackedYourProfileFbCount > 0)
          this.whoHackedYourProfileFbBadge = true;
        else
          this.whoHackedYourProfileFbBadge = false;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  inHackers() {
    let db = this.sqliteService.getDbInstance();
    db.executeSql('Select * from InstagramHackers', [])
      .then((data) => {
        let dataArray = [];
        if (data.rows.length > 0) {
          let length = data.rows.length;
          for (let i = 0; i < length; i++) {
            dataArray.push(data.rows.item(i));
          }
        }

        let dates = [];
        db.executeSql('Select distinct(date) from InstagramHackers', [])
          .then((dataDate) => {
            if (dataDate.rows.length > 0) {
              let length = dataDate.rows.length;
              for (let i = 0; i < length; i++) {
                dates.push(dataDate.rows.item(i));
              }
              this.navCtrl.push(InstagramHackersPage, {
                likers: dataArray,
                dates: dates
              });
            }else{
              this.navCtrl.push(InstagramHackersPage, {
                likers: [],
                dates: []
              });
            }
          });

      })
      .catch(e => {
        console.log(e);
      });
  }

  instagramHackers() {
    let db = this.sqliteService.getDbInstance();
    let env = this;

    if (env.hasOneDayPassedHackers()) {
      localStorage.removeItem("todaysHackersIn");
      localStorage.removeItem("hackerLengthIn");
      db.executeSql('SELECT COUNT(id) as user_count, id, name, picture, image_id, unique_id FROM InstagramLikers GROUP BY name ORDER BY user_count DESC', {})
        .then((data) => {
          let dataArray = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              dataArray.push(data.rows.item(i));
            }
          }

          if (dataArray.length > 0) {
            let lengthHackers = env.getRandomInt(1, 5);
            console.log(lengthHackers);

            let mySet = new Set();
            for (let i = 0; i < lengthHackers; i++) {
              mySet.add(env.getRandomInt(0, dataArray.length - 1));
              if (mySet.size < i + 1) {
                i--;
              }
            }
            let randomArray = Array.from(mySet);
            console.log(randomArray);
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
            localStorage.setItem("hackerLengthIn", JSON.stringify(hackerDataObj.length));
            localStorage.setItem("todaysHackersIn", JSON.stringify(hackerDataObj));

            env.hackersDbInsert();
          }

        })
        .catch(e => console.log(e));
    }

  }

  hackersDbInsert() {
    let env = this;
    let db = this.sqliteService.getDbInstance();
    if (localStorage.getItem("todaysHackersIn") == undefined || localStorage.getItem("hackerLengthIn") == undefined) {
      return;
    }
    let hackers = JSON.parse(localStorage.getItem("todaysHackersIn"));
    let index = JSON.parse(localStorage.getItem("hackerLengthIn")) - JSON.parse(localStorage.getItem("todaysHackersIn")).length;
    if (hackers.length == 0)
      return;
    db.executeSql('Insert into InstagramHackers(id,name,picture,image_id,unique_id,viewFlag,date) values(?,?,?,?,?,?,?)', [hackers[0].id, hackers[0].name, hackers[0].picture, hackers[0].image_id, hackers[0].unique_id, hackers[0].viewFlag, hackers[0].date])
      .then(() => {
        console.log('Inserted hacker in InstagramHackers Table');

        let notificationArray = [];

        // this.nativeStorage.getItem('whoViewedFbProfile')
        //   .then(
        //   data => {
            notificationArray.push({ "id": index, "text": hackers[0].name + ' intentó hackear tu instagram perfil.' });
            env.notifications2(notificationArray);
            env.badgeCounterHackers();
            // if (index == 0)
              env.notifierHackers();
          // },
          // error => {
          //   notificationArray.push({ "id": index, "text": env.nameEnc(viewers[0].name) + ' viewed your picture.' });
          //   env.notifications(notificationArray);
          //   env.badgeCounterViewers();
          //   if (index == 0)
          //     env.notifier();
          // }
          // );
      })
      .catch(e => {
        console.log(e);
      });
  }

  hasOneDayPassedHackers() {
    let date = new Date().toLocaleDateString();

    if (localStorage.getItem("todays_date_hackersIn") == date)
      return false;

    localStorage.setItem("todays_date_hackersIn", date);
    return true;

  }

  inViewers(){
    let db = this.sqliteService.getDbInstance();
    db.executeSql('Select * from InstagramViewers', [])
    .then((data) => {
      let dataArray = [];
      if (data.rows.length > 0) {
        let length = data.rows.length;
        for (let i = 0; i < length; i++) {
          dataArray.push(data.rows.item(i));
        }
      }

      let dates = [];
      db.executeSql('Select distinct(date) from InstagramViewers', [])
      .then((dataDate) => {
        if (dataDate.rows.length > 0) {
          let length = dataDate.rows.length;
          for (let i = 0; i < length; i++) {
            dates.push(dataDate.rows.item(i));
          }
          this.navCtrl.push(WhoViewedProfileInPage, {
            likers: dataArray,
            dates: dates
          });
        }else{
          this.navCtrl.push(WhoViewedProfileInPage, {
            likers: [],
            dates: []
          }); 
        }
      });

    })
    .catch(e => {
      console.log(e);
    });
  }

  instagramViewers(){
    let db = this.sqliteService.getDbInstance();
    let env = this;

    if(env.hasOneDayPassed()){
      localStorage.removeItem("todaysViewersIn");
      localStorage.removeItem("viewerLengthIn");
      db.executeSql('SELECT COUNT(id) as user_count, id, name, picture, image_id, unique_id FROM InstagramLikers GROUP BY name ORDER BY user_count DESC', {})
      .then((data) => {
        let dataArray = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            dataArray.push(data.rows.item(i));
          }
        }

        if(dataArray.length>0){
          let lengthViewers = env.getRandomInt(1,10);
          console.log(lengthViewers);
         
          let mySet = new Set();
          for(let i=0;i<lengthViewers;i++){
            mySet.add(env.getRandomInt(0,dataArray.length-1));
            if(mySet.size < i+1){
              i--;
            } 
          }
          let randomArray = Array.from(mySet);
          console.log(randomArray);
          let viewers = [];
          for(let i=0;i<randomArray.length;i++){
            viewers.push(dataArray[randomArray[i]]);
          }
  
          let length = viewers.length;
          let date = new Date().toLocaleDateString();

          let viewerDataObj = [];
          for (let i=0; i<length; i++) {

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
          localStorage.setItem("viewerLengthIn",JSON.stringify(viewerDataObj.length));
          localStorage.setItem("todaysViewersIn",JSON.stringify(viewerDataObj));

          env.viewersDbInsert();
        }

      })
      .catch(e => console.log(e));
    }

  }

  viewersDbInsert(){
    let env = this;
    let db = this.sqliteService.getDbInstance();
    if(localStorage.getItem("todaysViewersIn") == undefined || localStorage.getItem("viewerLengthIn") == undefined){
      return;
    }
    let viewers = JSON.parse(localStorage.getItem("todaysViewersIn"));
    let index = JSON.parse(localStorage.getItem("viewerLengthFb")) - JSON.parse(localStorage.getItem("todaysViewersIn")).length;
    if(viewers.length==0)
    return;
    db.executeSql('Insert into InstagramViewers(id,name,picture,image_id,unique_id,viewFlag,date) values(?,?,?,?,?,?,?)', [viewers[0].id, viewers[0].name, viewers[0].picture, viewers[0].image_id, viewers[0].unique_id,viewers[0].viewFlag, viewers[0].date])
    .then(() => {
        console.log('Inserted Liker in InstagramViewers Table');
        
        let notificationArray = [];

        this.nativeStorage.getItem('whoViewedInstagramProfile')
        .then(
          data => {
            notificationArray.push({"id":index,"text":viewers[0].name+' visto tu instagram perfil.'})
            env.notifications(notificationArray);
            env.badgeCounterViewers();
            if(index == 0)
            env.notifier();
          },
          error => {
            notificationArray.push({"id":index,"text":env.nameEnc(viewers[0].name)+' visto tu instagram perfil.'})
            env.notifications(notificationArray);
            env.badgeCounterViewers();
            if(index == 0)
            env.notifier();
          }
        );


    })
    .catch(e => {
      console.log(e);
    });
  }

  nameEnc(name) {
    let encName = "";
    let arr = name.split(' ');
    let tempArray = [];
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      tempArray.push(arr[i].substring(0, arr[i].length - 2).replace(/\S/gi, '*') + arr[i].substring(arr[i].length - 2, arr[i].length));
    }
    for (let i = 0; i < tempArray.length; i++) {
      encName += tempArray[i] + ' ';
    }
    console.log(encName.slice(0, -1));
    return encName.slice(0, -1);
  }

  notifications(array){
    this.localNotifications.schedule(array);
  }

  notifications2(array) {
    this.localNotifications2.schedule(array);
  }


  hasOneDayPassed(){
    let date = new Date().toLocaleDateString();
  
    if( localStorage.getItem("todays_date_in") == date ) 
        return false;
  
    localStorage.setItem("todays_date_in",date);
        return true;
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

  presentModal() {
    let modal = this.modalCtrl.create(InAppPurchaseInstagramPage);
    modal.present();
  }

  likesYouMost() {
  if(localStorage.getItem("online") == "false"){
      this.presentToast();
      return;
    }
    this.dbLikers();
  }

  mostLikedPhotos() {
    if(localStorage.getItem("online") == "false"){
        this.presentToast();
        return;
      }
      // this.instagramService.likesYouMost();
      this.dbPhotos();
    }

    dbPhotos() {
      let db = this.sqliteService.getDbInstance();
      let env = this;
      let loader = this.loading.create({
        content: 'Loading..',
      });
      loader.present().then(() => { 
      // db.executeSql('Select * from InstagramPhotos order by likesCount DESC', {})
      db.executeSql('Select InstagramPhotos.id, InstagramPhotos.source, count(InstagramLikers.id) as likesCount from InstagramPhotos LEFT JOIN InstagramLikers ON InstagramPhotos.id = InstagramLikers.image_id Group By InstagramLikers.image_id ORDER BY likesCount DESC', {})
        .then((data) => {
          let dataArray = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              dataArray.push(data.rows.item(i));
            }
          }
          console.log("......Photos ", dataArray);
          loader.dismiss();
          env.navCtrl.push(MyLikesPage, {
            mostLikedPhotosArray: dataArray
          });
        })
        .catch(e => {
          loader.dismiss();
          console.log(e);
        });
      });
    }
  
    dbLikers() {
      let db = this.sqliteService.getDbInstance();
      let env = this;
      let loader = this.loading.create({
        content: 'Loading..',
      });
      loader.present().then(() => {  
        // db.executeSql('SELECT * FROM InstagramLikers', {})
      db.executeSql('SELECT COUNT(id) as user_count, name, picture FROM InstagramLikers GROUP BY name ORDER BY user_count DESC', {})
        .then((data) => {
          let dataArray = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              dataArray.push(data.rows.item(i));
            }
          }
          console.log("......>>>><<<<<Instagram lIKERS", dataArray);
          loader.dismiss();
          env.navCtrl.push(YourLikersPage, {
            likers: dataArray
          });
        })
        .catch(e => console.log(e));
            });
    }


  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Settings',
      buttons: [
        {
          text: 'Logout',
          role: 'destructive',
          handler: () => {
            this.logout(); 
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            actionSheet.dismiss();
          }
        }
      ]
    });
    actionSheet.present();
  }

  errorHandler(event) {
    if(event)
    event.target.src = "../../assets/imgs/no-image.jpeg";
  }
}