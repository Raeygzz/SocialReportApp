import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';

@Injectable()
export class SqliteService {

  dbObject:SQLiteObject;

  constructor(public sqlite:SQLite) {
    this.createDatabase();
  }

  createDatabase(){
        return new Promise((resolve, reject) => {
            this.sqlite.create({
                name: 'data.db',
                location: 'default'
              })
                .then((db: SQLiteObject) => {
                    this.dbObject = db;
                    resolve(db);
                })
                .catch(e => {
                    console.log(e);
                });
        });

  }

  getDbInstance(){
    return this.dbObject;
  }

}
