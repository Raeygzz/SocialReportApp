import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqliteService } from '../../providers/sqlite';
import {LoadingController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-likes-me-most-fb',
  templateUrl: 'likes-me-most-fb.html',
})
export class LikesMeMostFbPage {

  likers: any = [];
  data: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqliteService: SqliteService, public loading : LoadingController) {

    // let loader = this.loading.create({
    //   content: 'Un Momento. Generando tu reporte',
    //   duration: 3000
    // });
    // loader.present().then(() => {
    this.data = true;
    this.likers = navParams.get("likers");
    console.log(navParams.get("likers"));
    // this.dbViewFlagUpdate();
    // }).catch(()=>{});
  }

  // dbViewFlagUpdate() {
  //   let db = this.sqliteService.getDbInstance();
  //   db.executeSql('Update FacebookLikers set viewFlag=? where type!=?', [1, 'LOVE'])
  //     .then(() => console.log('Updated Liker in FacebookLikers Table'))
  //     .catch(e => console.log(e));
  // }

}
