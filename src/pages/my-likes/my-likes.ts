import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqliteService } from '../../providers/sqlite';

@IonicPage()
@Component({
  selector: 'page-my-likes',
  templateUrl: 'my-likes.html',
})
export class MyLikesPage {

  mostLikedPhotosArray: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqliteService: SqliteService) {
    this.mostLikedPhotosArray = navParams.get("mostLikedPhotosArray");
    // this.dbViewFlagUpdate();
  }

  // dbViewFlagUpdate() {
  //   let db = this.sqliteService.getDbInstance();
  //   db.executeSql('Update InstagramPhotos set viewFlag=1', [])
  //     .then(() => console.log('Updated Photo in InstagramPhotos Table'))
  //     .catch(e => console.log(e));
  // }

}
