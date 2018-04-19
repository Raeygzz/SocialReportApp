import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {BackgroundMode} from '@ionic-native/background-mode';
import {SqliteService} from '../providers/sqlite';
import {Network} from '@ionic-native/network';

import {TabsPage} from '../pages/tabs/tabs';
declare var window : any;

@Component({templateUrl: 'app.html'})
export class MyApp {
  rootPage : any = TabsPage;

  constructor(public platform : Platform, public statusBar : StatusBar, public splashScreen : SplashScreen, private backgroundMode : BackgroundMode, public sqliteService : SqliteService, private network : Network) {
    platform
      .ready()
      .then(() => {

        statusBar.styleDefault();
        splashScreen.hide();
        this
          .backgroundMode
          .enable();
        this
          .backgroundMode
          .setDefaults({silent: true});
        localStorage.setItem("online", "true");

        this
          .sqliteService
          .createDatabase()
          .then((data : any) => {
            data
              .executeSql('CREATE TABLE IF NOT EXISTS FacebookPhotos (id INTEGER PRIMARY KEY , source, view' +
                'Flag INTEGER)', {})
              .then(() => console.log('FacebookPhotos Table Created!!!'))
              .catch(e => console.log(e));
          });

        this
          .sqliteService
          .createDatabase()
          .then((data : any) => {
            data
              .executeSql('CREATE TABLE IF NOT EXISTS FacebookLikers (id, name, picture, image_id, unique_i' +
                'd VARCHAR PRIMARY KEY, type, viewFlag INTEGER)', {})
              .then(() => console.log('FacebookLikers Table Created!!!'))
              .catch(e => console.log(e));
          });

        this
          .sqliteService
          .createDatabase()
          .then((data : any) => {
            data
              .executeSql('CREATE TABLE IF NOT EXISTS InstagramPhotos (id VARCHAR PRIMARY KEY , source, vie' +
                'wFlag INTEGER)', {})
              .then(() => console.log('InstagramPhotos Table Created!!!'))
              .catch(e => console.log(e));
          });

        this
          .sqliteService
          .createDatabase()
          .then((data : any) => {
            data
              .executeSql('CREATE TABLE IF NOT EXISTS InstagramLikers (id ,name, picture, image_id, unique_' +
                'id VARCHAR PRIMARY KEY, viewFlag INTEGER)', {})
              .then(() => console.log('InstagramLikers Table Created!!!'))
              .catch(e => console.log(e));
          });

        this
          .sqliteService
          .createDatabase()
          .then((data : any) => {
            data
              .executeSql('CREATE TABLE IF NOT EXISTS InstagramViewers (id ,name, picture, image_id, unique' +
                '_id VARCHAR PRIMARY KEY, viewFlag INTEGER, date VARCHAR)', {})
              .then(() => console.log('InstagramLikers Table Created!!!'))
              .catch(e => console.log(e));
          });

        this
          .sqliteService
          .createDatabase()
          .then((data : any) => {
            data
              .executeSql('CREATE TABLE IF NOT EXISTS FacebookViewers (id ,name, picture, image_id, unique_' +
                'id VARCHAR PRIMARY KEY,viewFlag INTEGER, date VARCHAR)', {})
              .then(() => console.log('FacebookViewers Table Created!!!'))
              .catch(e => console.log(e));
          });

        this
          .sqliteService
          .createDatabase()
          .then((data : any) => {
            data
              .executeSql('CREATE TABLE IF NOT EXISTS FacebookHackers (id ,name, picture, image_id, unique_' +
                'id VARCHAR PRIMARY KEY,viewFlag INTEGER, date VARCHAR)', {})
              .then(() => console.log('FacebookHackers Table Created!!!'))
              .catch(e => console.log(e));
          });

        this
          .sqliteService
          .createDatabase()
          .then((data : any) => {
            data
              .executeSql('CREATE TABLE IF NOT EXISTS InstagramHackers (id ,name, picture, image_id, unique' +
                '_id VARCHAR PRIMARY KEY,viewFlag INTEGER, date VARCHAR)', {})
              .then(() => console.log('InstagramHackers Table Created!!!'))
              .catch(e => console.log(e));
          });

        let disconnectSubscription,
          connectSubscription;

        disconnectSubscription = this
          .network
          .onDisconnect()
          .subscribe(() => {
            console.log('network was disconnected :-(');
            localStorage.setItem("online", "false");
          });

        connectSubscription = this
          .network
          .onConnect()
          .subscribe(() => {
            localStorage.setItem("online", "true");
            console.log('network connected!');
          });

        function onSuccess(result) {
          console.log("AppsFlyer SDK successfully initiated:", result);
        };

        function onError(err) {
          console.log("AppsFlyer SDK failed to init:", err);
        };

        const options = {
          devKey: 'wtReduzb6GWm4hsgMiNPAX',
          isDebug: false,
          onInstallConversionDataListener: true
        };

        window
          .plugins
          .appsFlyer
          .initSdk(options, onSuccess, onError);

      });

  }
}


export default window;