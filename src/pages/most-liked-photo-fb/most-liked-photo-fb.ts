import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqliteService } from '../../providers/sqlite';
import {LoadingController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-most-liked-photo-fb',
  templateUrl: 'most-liked-photo-fb.html',
})
export class MostLikedPhotoFbPage {

  // mostLikedPhotosArray:any;
  mostLikedPhotosArray:any = [];        //edited

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqliteService:SqliteService, public loading : LoadingController) {

    // let loader = this.loading.create({
    //     content: 'Un Momento. Generando tu reporte',
    //     duration: 3000
    //   });
    //   loader.present().then(() => {
    this.mostLikedPhotosArray = navParams.get("mostLikedPhotosArray");
    // this.dbViewFlagUpdate();
    // }).catch(()=>{});
  }

  // dbViewFlagUpdate() {
  //   let db = this.sqliteService.getDbInstance();
  //         db.executeSql('Update FacebookPhotos set viewFlag=?', [1])
  //         .then(() => console.log('Updated Photo in FacebookPhotos Table'))
  //         .catch(e => console.log(e));
  // }
}
