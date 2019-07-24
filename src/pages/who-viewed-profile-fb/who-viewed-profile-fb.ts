import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqliteService } from '../../providers/sqlite';
import {LoadingController} from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-who-viewed-profile-fb',
  templateUrl: 'who-viewed-profile-fb.html',
})
export class WhoViewedProfileFbPage {

  likers: any = [];
  dates: any = [];
  viewData: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqliteService: SqliteService, public loading : LoadingController, private alertCtrl: AlertController) {

    let loader = this.loading.create({
      content: 'Un Momento. Generando tu reporte',
      duration: 3000
    });
    

    loader.present().then(() => {        //edited
    this.likers = navParams.get("likers");
    this.dates = navParams.get("dates");
    console.log('whoViewedProfile: this.likers', this.likers);
    console.log('whoViewedProfile: this.dates', this.dates);

    let env = this;
    let viewData = [];
    let dateL = this.dates.length;

    if(this.likers.length != 0 && this.dates.length != 0) {
      for(let i=0;i<dateL;i++){
        let viewers = this.likers.filter(function(liker){
          return liker.date == env.dates[i].date;
        });
        console.log("viewers "+i, viewers);
        env.viewData.push({"date": env.dates[i],"viewers":viewers});
        console.log("viewData", env.viewData);
      }
    } else {
      loader.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Nadie ha visto tu perfil todavía!!.',
        buttons: [
          {
            text: 'OK',
            role: 'Yes',
            handler: () => {
              alert.dismiss().then(() => {
                console.log('OK');
            });
            return false;
            }
          }]
      });
      alert.present();
    }
    
    // this.dbViewFlagUpdate();
    }).catch(() => {
      loader.dismiss();
    });
  }

  // dbViewFlagUpdate() {
  //   let db = this.sqliteService.getDbInstance();
  //   db.executeSql('Update FacebookViewers set viewFlag=1', [])
  //     .then(() => console.log('Updated viewer in FacebookViewers Table'))
  //     .catch(e => console.log(e));
  // }

}