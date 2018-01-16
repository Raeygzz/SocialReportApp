import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqliteService } from '../../providers/sqlite';


@IonicPage()
@Component({
  selector: 'page-laugh-react',
  templateUrl: 'laugh-react.html',
})
export class LaughReactPage {

  likers:any = [];
  data:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqliteService:SqliteService) {
    this.likers = navParams.get("likers");
    console.log(navParams.get("likers"));
    this.data = true;
    // this.dbViewFlagUpdate();
  }

  // dbViewFlagUpdate() {
  //   let db = this.sqliteService.getDbInstance();
  //         db.executeSql('Update FacebookLikers set viewFlag=? where type=?', [1, 'HAHA'])
  //         .then(() => console.log('Updated Liker in FacebookLikers Table'))
  //         .catch(e => console.log(e));
  // }

}
