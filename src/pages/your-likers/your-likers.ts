import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqliteService } from '../../providers/sqlite';

@IonicPage()
@Component({
  selector: 'page-your-likers',
  templateUrl: 'your-likers.html',
})
export class YourLikersPage {
  
  likers:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqliteService:SqliteService) {
    this.likers = this.navParams.get("likers");
    // this.dbViewFlagUpdate();
  }

  // dbViewFlagUpdate() {
  //   let db = this.sqliteService.getDbInstance();
  //         db.executeSql('Update InstagramLikers set viewFlag=1', [])
  //         .then(() => console.log('Updated Liker in InstagramLikers Table'))
  //         .catch(e => console.log(e));
  // }


}
