import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook } from '@ionic-native/facebook';
import { SqliteService } from './sqlite';
import { UserService } from './user-service';
import { SQLitePorter } from '@ionic-native/sqlite-porter';

@Injectable()
export class FacebookService {

  id: any;
  likers = [];
  mediaInfoArray = [];
  fnName: String = "mostLiked";
  photosArray: any = [];
  likersArray: any = [];

  constructor(
    private nativeStorage: NativeStorage,
    public fb: Facebook,
    public sqliteService: SqliteService,
    public sqlitePorter: SQLitePorter,
    public userService: UserService
  ) {
    var vm = this;
    this.nativeStorage.getItem('fbUser')//get the user data
      .then((data) => {
        console.log("fb profile", data);
        vm.id = data.id;
      });
  }

  getID() {
    return new Promise((resolve, reject) => {
      let vm = this;
      this.nativeStorage.getItem('fbUser')//get the user data
        .then((data) => {
          if (data.id) {
            vm.id = data.id;
            resolve(true);
          }
        })
        .catch(() => reject(false));
    });
  }

  mostLikedPhotos(flagDbSetup) {
    let promiseFinal = new Promise((resolve, reject) => {
      if (localStorage.getItem("online") == "false") {
        return;
      }
      let env = this;
      let params = new Array<string>();
      let db = env.sqliteService.getDbInstance();
      env.getID().then(data => {
        if (data == true) {
          // env.fb.api("/" + env.id + "/photos/?fields=picture%2Clikes.limit(999)%7Bpic_small%2Cname%7D&limit=999&type=uploaded", params).then((userPhotos) => {
          env.fb.api("/" + env.id + "/photos?fields=id%2Cpicture%2Creactions.limit(9999)%7Bid%2Cpic_small%2Cname%2Ctype%7D&limit=9999&type=uploaded", params).then((userPhotos) => {
            console.log("UPLOADED.. Fb", userPhotos);
            // env.fb.api("/" + env.id + "/photos/?fields=picture%2Clikes.limit(999)%7Bpic_small%2Cname%7D&limit=999&type=tagged", params).then((userTaggedPhotos) => {
            env.fb.api("/" + env.id + "/photos?fields=id%2Cpicture%2Creactions.limit(9999)%7Bid%2Cpic_small%2Cname%2Ctype%7D&limit=9999&type=tagged", params).then((userTaggedPhotos) => {

              console.log("Tagged.. Fb", userTaggedPhotos);
              let getDataTaggedArray = userTaggedPhotos.data;

              let tempTaggedArray = getDataTaggedArray.filter(function (temp) {
                return temp.reactions != undefined;
              });

              let getDataArray = userPhotos.data;

              let tempArray = getDataArray.filter(function (temp) {
                return temp.reactions != undefined;
              });

              let data = {
                "data": {
                  "inserts": {
                    "FacebookLikers": [
                    ],
                    "FacebookPhotos": [
                    ]
                  }
                }
              };

              for (let i = 0; i < tempTaggedArray.length; i++) {

                let photoData = {
                  "id": tempTaggedArray[i].id,
                  "source": tempTaggedArray[i].picture,
                  "viewFlag": 0
                };

                data.data.inserts.FacebookPhotos.push(photoData);

                  if (env.photosArray.length < 6 && env.photosArray.length < tempTaggedArray.length){
                    env.photosArray.push(photoData);
                  }
                  else{
                    if(localStorage.getItem("photosArrayFbTemp") == null){
                      localStorage.setItem("photosArrayFbTemp",JSON.stringify(env.photosArray));
                    }
                  }

                for (let j = 0; j < tempTaggedArray[i].reactions.data.length; j++) {

                  let likerData = {
                    "id": tempTaggedArray[i].reactions.data[j].id,
                    "name": tempTaggedArray[i].reactions.data[j].name,
                    "picture": tempTaggedArray[i].reactions.data[j].pic_small,
                    "image_id": tempTaggedArray[i].id,
                    "unique_id": "" + tempTaggedArray[i].reactions.data[j].id + tempTaggedArray[i].id,
                    "type": tempTaggedArray[i].reactions.data[j].type,
                    "viewFlag": 0
                  };

                  data.data.inserts.FacebookLikers.push(likerData);


                  if (env.likersArray.length < 6 && env.likersArray.length < tempTaggedArray[i].reactions.data){
                    env.likersArray.push(likerData);
                    if(env.likersArray.length == tempTaggedArray[i].reactions.data){
                      resolve(true);
                    }
                  }
                  else{
                    if(localStorage.getItem("likersArrayFbTemp") == null){
                      localStorage.setItem("likersArrayFbTemp",JSON.stringify(env.likersArray));
                      resolve(true);
                    }
                  }

                }

              }

              for (let i = 0; i < tempArray.length; i++) {

                let photoData = {
                  "id": tempArray[i].id,
                  "source": tempArray[i].picture,
                  "viewFlag": 0
                };

                data.data.inserts.FacebookPhotos.push(photoData);


                for (let j = 0; j < tempArray[i].reactions.data.length; j++) {

                  let likerData = {
                    "id": tempArray[i].reactions.data[j].id,
                    "name": tempArray[i].reactions.data[j].name,
                    "picture": tempArray[i].reactions.data[j].pic_small,
                    "image_id": tempArray[i].id,
                    "unique_id": "" + tempArray[i].reactions.data[j].id + tempArray[i].id,
                    "type": tempArray[i].reactions.data[j].type,
                    "viewFlag": 0
                  };

                  data.data.inserts.FacebookLikers.push(likerData);

                }

              }

              if (flagDbSetup) {
                env.JsonToDb(db, data).then(() => {
                  // resolve(true);
                }).catch(() => {
                  reject(true);
                });
              } else {
                let LikersData = data.data.inserts.FacebookLikers.slice(0);
                let PhotosData = data.data.inserts.FacebookPhotos.slice(0);
                env.checkNewLiker(db, LikersData);
                env.checkNewPhoto(db, PhotosData);
              }


            });
          }).catch(() => {
            env.doFbLogout();
            reject(true);
            console.log("Missing Fb ID");
          });
        }
      });
    });
    return promiseFinal;
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  JsonToDb(db, data) {
    return new Promise((resolve, reject) => {
      this.sqlitePorter.importJsonToDb(db, data)
        .then(() => {
          console.log('Imported');
          resolve(true);
        })
        .catch(e => {
          console.error(e);
          this.doFbLogout().then(() => {
            reject(true);
          });
        });
    }
    );
  }

  checkNewLiker(db, LikersData) {
    db.executeSql('Select * from FacebookLikers', {})
      .then((dataDb) => {
        let dataArray = [];
        if (dataDb.rows.length > 0) {
          for (let i = 0; i < dataDb.rows.length; i++) {
            dataArray.push(dataDb.rows.item(i));
          }
        }

        if (dataArray.length == 0) {
          return;
        }

        let newLikers = LikersData.filter(this.comparerLikers(dataArray));
        console.log("newLikers", newLikers);
        let unLikers = dataArray.filter(this.comparerLikers(LikersData));
        console.log("unLikers", unLikers);

        if (newLikers.length > 0) {
          this.insertNewLikers(newLikers, db);
        }
        if (unLikers.length > 0) {
          this.deleteUnLikers(unLikers, db);
        }
      })
      .catch(e => console.log(e));
  }

  checkNewPhoto(db, PhotosData) {
    db.executeSql('Select * from FacebookPhotos', {})
      .then((dataDb) => {
        let dataArray = [];
        if (dataDb.rows.length > 0) {
          for (let i = 0; i < dataDb.rows.length; i++) {
            dataArray.push(dataDb.rows.item(i));
          }
        }

        if (dataArray.length == 0) {
          return;
        }

        let newPhotos = PhotosData.filter(this.comparerPhotos(dataArray));
        console.log("newPhotos", newPhotos);
        let deletedPhotos = dataArray.filter(this.comparerPhotos(PhotosData));
        console.log("deletedPhotos", deletedPhotos);

        if (newPhotos.length > 0) {
          this.insertNewPhotos(newPhotos, db);
        }
        if (deletedPhotos.length > 0) {
          this.deletePhotos(deletedPhotos, db);
        }

      })
      .catch(e => console.log(e));
  }

  comparerLikers(otherArray) {
    return function (current) {
      return otherArray.filter(function (other) {
        return other.unique_id == current.unique_id
      }).length == 0;
    }
  }

  comparerPhotos(otherArray) {
    return function (current) {
      return otherArray.filter(function (other) {
        return other.id == current.id
      }).length == 0;
    }
  }

  insertNewPhotos(photos, db) {
    for (let i = 0; i < photos.length; i++) {
      db.executeSql('INSERT INTO FacebookPhotos (id, source, viewFlag) VALUES (?, ?, ?)', [photos[i].id, photos[i].source, 0])
        .then((dataDb) => {
          console.log('New Photo Inserted');
        });
    }
  }

  deletePhotos(photos, db) {
    for (let i = 0; i < photos.length; i++) {
      db.executeSql('Delete from FacebookPhotos where id=?', [photos[i].id])
        .then((dataDb) => {
          console.log('Photo Deleted');
        });
    }
  }

  insertNewLikers(likers, db) {
    for (let i = 0; i < likers.length; i++) {
      db.executeSql('INSERT INTO FacebookLikers (id,name,picture,image_id,unique_id,type,viewFlag) VALUES (?, ?, ?, ?, ?, ?)', [likers[i].id, likers[i].name, likers[i].picture, likers[i].image_id, likers[i].unique_id, likers[i].type, 0])
        .then((dataDb) => {
          console.log('New Liker Inserted');
        });
    }
  }

  deleteUnLikers(unlikers, db) {
    for (let i = 0; i < unlikers.length; i++) {
      db.executeSql('Delete from FacebookLikers where unique_id=?', [unlikers[i].unique_id])
        .then((dataDb) => {
          console.log('Liker Deleted');
        });
    }
  }

  doFbLogout() {
    let env = this;
    return new Promise((resolve, reject) => {
      this.fb.logout()
        .then(function (response) {
          localStorage.removeItem("todays_date");
          localStorage.removeItem("todays_date_hackers");
          localStorage.removeItem("todaysViewers");
          localStorage.removeItem("viewerLengthFb");
          localStorage.removeItem("todaysHackers");
          localStorage.removeItem("hackerLengthFb");
          localStorage.removeItem("photosArrayFbTemp");
          localStorage.removeItem("likersArrayFbTemp");
          env.nativeStorage.remove('fbUser').then(
            () => {
              let db = env.sqliteService.getDbInstance();
              db.executeSql('Delete FROM FacebookLikers', {})
                .then((dataDb) => {
                  console.log("FacebookLikers table deleted")
                });
              db.executeSql('Delete FROM FacebookPhotos', {})
                .then((dataDb) => {
                  console.log("FacebookPhotos table deleted")
                });
              db.executeSql('Delete FROM FacebookViewers', {})
                .then((dataDb) => {
                  console.log("FacebookViewers table deleted")
                });
              db.executeSql('Delete FROM FacebookHackers', {})
                .then((data) => {
                  console.log("FacebookHackers table deleted")
                });
              resolve(true);
            },
            error => {
              reject(true);
            }
          );
        }, function (error) {
          reject(true);
        });
    });
  }


  dbView() {
    return new Promise((resolve, reject) => {
      let db = this.sqliteService.getDbInstance();
      db.executeSql('SELECT COUNT(id) as user_count, name, picture FROM FacebookLikers where type != ? GROUP BY name ORDER BY user_count DESC', ['LOVE'])
        .then((data) => {
          let dataArray = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              dataArray.push(data.rows.item(i));
            }
          }
          console.log("......>>>><<<<<fACEBOOK lIKERS", dataArray);
          resolve(dataArray);
        })
        .catch(e => {
          console.log(e);
          reject(true);
        });
    });
  }


}