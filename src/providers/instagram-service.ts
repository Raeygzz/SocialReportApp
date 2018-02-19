import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { UserService } from './user-service';
import { SqliteService } from './sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Injectable()
export class InstagramService {

  token: any;
  mediaInfoArray = [];
  photosArray: any = [];
  likersArray: any = [];

  constructor(
    private nativeStorage: NativeStorage,
    private UserService: UserService,
    private sqliteService: SqliteService,
    public sqlitePorter: SQLitePorter,
    public localNotifications: LocalNotifications  
  ) {
    this.nativeStorage.getItem("inToken")
      .then(
      data => {
        console.log("service , token", data);
        this.token = data;
      },
      error => {
      }
      );
  }

  likesYouMost(flagDbSetup) {
    let env = this;
    let finalPromise = new Promise((resolve, reject) => {

      let db = env.sqliteService.getDbInstance();
      env.mediaInfoArray = [];
      env.nativeStorage.getItem("inToken")
        .then(
        dataToken => {
          env.token = dataToken;
          env.UserService.getSelfMedia(env.token)
            .then((response: any) => {
              
              let mediaArray = response.data;
              console.log("Instagram Data",response.data);
              let mediaIdArray = [];

              let mediaByID = function (mediaId) {

                let promise = new Promise((resolve, reject) => {
                  env.UserService.getSelfMediaLikes(env.token, mediaId)
                    .then((response: any) => {
                      let userMediaInfo = response.data;
                      let res = {
                        "data": userMediaInfo,
                        "media_id": mediaId
                      };
                      resolve(res);
                    }).catch(() => {
                      reject(true);
                    });

                });
                return promise;
              };


              let data = {
                "data": {
                  "inserts": {
                    "InstagramLikers": [
                    ],
                    "InstagramPhotos": [
                    ]
                  }
                }
            };   


              let media = function (mediaIdArray, i) {
                resolve(true);
                mediaByID(mediaIdArray[i]).then(function (dataMedia) {
                  let temp = (dataMedia as any).data;
                  let image_id = (dataMedia as any).media_id;
                  for (let j = 0; j < temp.length; j++) {
                    let likerData = {
                      "id": temp[j].id,
                      "name": temp[j].full_name,
                      "picture": temp[j].profile_picture,
                      "image_id": image_id,
                      "unique_id": "" + temp[j].id + image_id,
                      "viewFlag": 0
                      };
                    data.data.inserts.InstagramLikers.push(likerData);

                    if (env.likersArray.length < 6 && env.likersArray.length < temp.length){
                      env.likersArray.push(likerData);
                    }
                    else{
                      if(localStorage.getItem("likersArrayInTemp") == null){
                        localStorage.setItem("likersArrayInTemp",JSON.stringify(env.likersArray));
                      }
                    }
                    
                  }

                  i++;
                  if (i != mediaIdArray.length) {
                    media(mediaIdArray, i);
                  }
                  if(i == mediaIdArray.length){

                  if(flagDbSetup){
                    env.JsonToDb(db,data).then(() => {
                      // resolve(true);
                    }).catch(() => {
                      reject(true);
                    });
                  }else{
                    let LikersData = data.data.inserts.InstagramLikers.slice(0);
                    let PhotosData = data.data.inserts.InstagramPhotos.slice(0);
                    env.checkNewLiker(db, LikersData);
                    env.checkNewPhoto(db, PhotosData);
                  }

                  }
                }.bind(this)).catch(() => {
                  reject(true);
                });

              };

              for (let i = 0; i < mediaArray.length; i++) {
                let photoData = {
                  "id": mediaArray[i].id,
                  "source": mediaArray[i].images.low_resolution.url,
                  "viewFlag": 0
                };
                data.data.inserts.InstagramPhotos.push(photoData);

                if (env.photosArray.length < 6  && env.photosArray.length < mediaArray.length){
                  env.photosArray.push(photoData);
                  // if(env.photosArray.length == mediaArray.length){
                    
                  // }
                }
                else{
                  if(localStorage.getItem("photosArrayInTemp") == null){
                    localStorage.setItem("photosArrayInTemp",JSON.stringify(env.photosArray));
                    resolve(true);
                  }
                }

              }

              for (let i = 0; i < mediaArray.length; i++) {
                mediaIdArray.push(mediaArray[i].id);
              }
              media(mediaIdArray, 0);
            }).catch(()=>{
              reject(true);
            });
        },
        error => {
          reject(true);
        }
        );


    });
    return finalPromise;

  }

  JsonToDb(db,data){
    return new Promise((resolve, reject) => {
      this.sqlitePorter.importJsonToDb(db, data)
      .then(() => {
        console.log('Imported');
          resolve(true);
      })
      .catch(e => {
        console.error(e);
        this.logout().then(() => {
          reject(true);
        });
      });
    }
    );
  }

  checkNewLiker(db,LikersData){
    db.executeSql('Select * from InstagramLikers', {})
    .then((dataDb) => {
      let dataArray = [];
      if (dataDb.rows.length > 0) {
        for (let i = 0; i < dataDb.rows.length; i++) {
          dataArray.push(dataDb.rows.item(i));
        }
      }

      if(dataArray.length == 0){
        return;
      }

      let newLikers = LikersData.filter(this.comparerLikers(dataArray));
      console.log("newLikers Instagram",newLikers);
      let unLikers = dataArray.filter(this.comparerLikers(LikersData));
      console.log("unLikers Instagram",unLikers);

      if(newLikers.length>0){
        this.insertNewLikers(newLikers, db);
      }
      if(unLikers.length>0){
        this.deleteUnLikers(unLikers, db);
      }
    })
    .catch(e => console.log(e));
  }

  checkNewPhoto(db,PhotosData){
    db.executeSql('Select * from InstagramPhotos', {})
    .then((dataDb) => {
      let dataArray = [];
      if (dataDb.rows.length > 0) {
        for (let i = 0; i < dataDb.rows.length; i++) {
          dataArray.push(dataDb.rows.item(i));
        }
      }

      if(dataArray.length == 0){
        return;
      }

      let newPhotos = PhotosData.filter(this.comparerPhotos(dataArray));
      console.log("newPhotos",newPhotos);
      let deletedPhotos = dataArray.filter(this.comparerPhotos(PhotosData));
      console.log("deletedPhotos",deletedPhotos);

      if(newPhotos.length>0){
        this.insertNewPhotos(newPhotos, db);
      }
      if(deletedPhotos.length>0){
        this.deletePhotos(deletedPhotos, db);
      }

    })
    .catch(e => console.log(e));
  }

  comparerLikers(otherArray){
    return function(current){
      return otherArray.filter(function(other){
        return other.unique_id == current.unique_id
      }).length == 0;
    }
  }

  comparerPhotos(otherArray){
    return function(current){
      return otherArray.filter(function(other){
        return other.id == current.id
      }).length == 0;
    }
  }
  
  insertNewPhotos(photos, db){
    for(let i=0;i<photos.length;i++){
      db.executeSql('INSERT INTO InstagramPhotos (id, source, viewFlag) VALUES (?, ?, ?)', [photos[i].id, photos[i].source, 0])
      .then((dataDb) => {
        console.log('New Photo Inserted');
      });
    }
  }

  deletePhotos(photos, db){
    for(let i=0;i<photos.length;i++){
      db.executeSql('Delete from InstagramPhotos where id=?', [photos[i].id])
      .then((dataDb) => {
        console.log('Photo Deleted');
      });
    }
  }

  insertNewLikers(likers, db){
    for(let i=0;i<likers.length;i++){
      db.executeSql('INSERT INTO InstagramLikers (id,name,picture,image_id,unique_id,viewFlag) VALUES (?, ?, ?, ?, ?, ?)', [likers[i].id, likers[i].name, likers[i].picture, likers[i].image_id, likers[i].unique_id, 0])
      .then((dataDb) => {
        console.log('New Liker Inserted');
      });
    }
  }

  deleteUnLikers(unlikers, db){
    for(let i=0;i<unlikers.length;i++){
      db.executeSql('Delete from InstagramLikers where unique_id=?', [unlikers[i].unique_id])
      .then((dataDb) => {
        console.log('Liker Deleted');
      });
    }
  }

  notifications(array){
    this.localNotifications.schedule(array);
  }

  logout() {
    let env = this;
    return new Promise((resolve, reject) => {
      localStorage.removeItem("todays_date_hackersIn");
      localStorage.removeItem("todaysHackersIn");
      localStorage.removeItem("hackerLengthIn");
      localStorage.removeItem("todaysViewersIn");
      localStorage.removeItem("viewerLengthIn");
      localStorage.removeItem("todays_date_in");
      localStorage.removeItem("photosArrayInTemp");
      localStorage.removeItem("likersArrayInTemp");
    env.nativeStorage.remove("inToken").then(
      () => {
        let db = env.sqliteService.getDbInstance();
        db.executeSql('Delete FROM InstagramLikers', {})
        .then((dataDb) => {
          console.log("InstagramLikers table deleted")
        });
        db.executeSql('Delete FROM InstagramPhotos', {})
        .then((dataDb) => {
          console.log("InstagramPhotos table deleted")
        });
        db.executeSql('Delete FROM InstagramViewers', {})
        .then((dataDb) => {
          console.log("InstagramViewers table deleted")
        });
        db.executeSql('Delete FROM InstagramHackers', {})
        .then((data) => {
          console.log("InstagramHackers table deleted")
        });
        resolve(true);
      },
      error => {
        reject(true);
      }
    );
  });
  }



}