import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqliteService } from '../../providers/sqlite';

@IonicPage()
@Component({
  selector: 'page-instagram-hackers',
  templateUrl: 'instagram-hackers.html',
})
export class InstagramHackersPage {

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
  //   db.executeSql('Update InstagramHackers set viewFlag=1', [])
  //     .then(() => console.log('Updated viewer in InstagramHackers Table'))
  //     .catch(e => console.log(e));
  // }


}
