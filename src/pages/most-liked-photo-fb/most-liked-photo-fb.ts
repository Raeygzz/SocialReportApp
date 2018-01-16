import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqliteService } from '../../providers/sqlite';

@IonicPage()
@Component({
  selector: 'page-most-liked-photo-fb',
  templateUrl: 'most-liked-photo-fb.html',
})
export class MostLikedPhotoFbPage {

  mostLikedPhotosArray:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqliteService:SqliteService) {
    this.mostLikedPhotosArray = navParams.get("mostLikedPhotosArray");
    this.dbViewFlagUpdate();
  }

  dbViewFlagUpdate() {
    let db = this.sqliteService.getDbInstance();
          db.executeSql('Update FacebookPhotos set viewFlag=?', [1])
          .then(() => console.log('Updated Photo in FacebookPhotos Table'))
          .catch(e => console.log(e));
  }
}
