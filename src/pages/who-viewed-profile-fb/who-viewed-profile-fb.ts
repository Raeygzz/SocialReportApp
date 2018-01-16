import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqliteService } from '../../providers/sqlite';

@IonicPage()
@Component({
  selector: 'page-who-viewed-profile-fb',
  templateUrl: 'who-viewed-profile-fb.html',
})
export class WhoViewedProfileFbPage {

  likers: any = [];
  dates: any = [];
  viewData: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqliteService: SqliteService) {
    this.likers = navParams.get("likers");
    this.dates = navParams.get("dates");
    console.log(this.likers,this.dates);
    let env = this;
    let viewData = [];
    let dateL = this.dates.length;
    for(let i=0;i<dateL;i++){
      let viewers = this.likers.filter(function(liker){
        return liker.date == env.dates[i].date;
      });
      console.log("viewers "+i, viewers);
      env.viewData.push({"date": env.dates[i],"viewers":viewers});
    }
    console.log("viewData",viewData);

    // this.dbViewFlagUpdate();
  }

  // dbViewFlagUpdate() {
  //   let db = this.sqliteService.getDbInstance();
  //   db.executeSql('Update FacebookViewers set viewFlag=1', [])
  //     .then(() => console.log('Updated viewer in FacebookViewers Table'))
  //     .catch(e => console.log(e));
  // }

}