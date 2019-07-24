import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import { TabsPageModule } from '../pages/tabs/tabs.module';
// import { InstagramHomePageModule } from '../pages/instagram-home/instagram-home.module';
import { FacebookHomePageModule } from '../pages/facebook-home/facebook-home.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
// import { ProfilePageModule } from '../pages/profile/profile.module';
// import { YourLikersPageModule } from '../pages/your-likers/your-likers.module';
// import { MyLikesPageModule } from '../pages/my-likes/my-likes.module';
import { FacebookProfilePageModule } from '../pages/facebook-profile/facebook-profile.module';
import { MostLikedPhotoFbPageModule } from '../pages/most-liked-photo-fb/most-liked-photo-fb.module';
import { LikesMeMostFbPageModule } from '../pages/likes-me-most-fb/likes-me-most-fb.module';
import { WhoViewedProfileFbPageModule } from '../pages/who-viewed-profile-fb/who-viewed-profile-fb.module';
// import { WhoViewedProfileInPageModule } from '../pages/who-viewed-profile-in/who-viewed-profile-in.module';
import { InAppPurchasePageModule } from '../pages/in-app-purchase/in-app-purchase.module';
// import { InAppPurchaseInstagramPageModule } from '../pages/in-app-purchase-instagram/in-app-purchase-instagram.module';
import { HeartReactPageModule } from '../pages/heart-react/heart-react.module';
import { LaughReactPageModule } from '../pages/laugh-react/laugh-react.module';
import { FacebookHackersPageModule } from '../pages/facebook-hackers/facebook-hackers.module';
// import { InstagramHackersPageModule } from '../pages/instagram-hackers/instagram-hackers.module';
import { InAppPurchaseFbCrushPageModule } from '../pages/in-app-purchase-fb-crush/in-app-purchase-fb-crush.module';
import { InAppPurchaseFbLikersPageModule } from '../pages/in-app-purchase-fb-likers/in-app-purchase-fb-likers.module';
import { InAppPurchaseFbLovePageModule } from '../pages/in-app-purchase-fb-love/in-app-purchase-fb-love.module';
import { InAppPurchaseFbLaughPageModule } from '../pages/in-app-purchase-fb-laugh/in-app-purchase-fb-laugh.module';
import { InAppPurchaseFbPhotosPageModule } from '../pages/in-app-purchase-fb-photos/in-app-purchase-fb-photos.module';
// import { InAppPurchaseInPhotosPageModule } from '../pages/in-app-purchase-in-photos/in-app-purchase-in-photos.module';
// import { InAppPurchaseInLikersPageModule } from '../pages/in-app-purchase-in-likers/in-app-purchase-in-likers.module';
// import { InAppPurchaseInCrushPageModule } from '../pages/in-app-purchase-in-crush/in-app-purchase-in-crush.module';
import { ComponentsModule } from '../components/components.module';

import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { Network } from '@ionic-native/network';
import { SQLite } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';

import { UserService } from '../providers/user-service';
import { FacebookService } from '../providers/facebook-service';
// import { InstagramService } from '../providers/instagram-service';
import { SqliteService } from '../providers/sqlite';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
    }),
    HttpModule,
    TabsPageModule,
    // InstagramHomePageModule,
    FacebookHomePageModule,
    SettingsPageModule,
    // ProfilePageModule,
    // YourLikersPageModule,
    // MyLikesPageModule,
    FacebookProfilePageModule,
    MostLikedPhotoFbPageModule,
    LikesMeMostFbPageModule,
    WhoViewedProfileFbPageModule,
    // WhoViewedProfileInPageModule,
    InAppPurchasePageModule,
    // InAppPurchaseInstagramPageModule,
    HeartReactPageModule,
    LaughReactPageModule,
    FacebookHackersPageModule,
    // InstagramHackersPageModule,
    InAppPurchaseFbCrushPageModule,
    InAppPurchaseFbLikersPageModule,
    InAppPurchaseFbLovePageModule,
    InAppPurchaseFbLaughPageModule,
    InAppPurchaseFbPhotosPageModule,
    // InAppPurchaseInLikersPageModule,
    // InAppPurchaseInCrushPageModule,
    // InAppPurchaseInPhotosPageModule,
    ComponentsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: UserService, useClass: UserService},
    {provide: FacebookService, useClass: FacebookService},
    // {provide: InstagramService, useClass: InstagramService},
    {provide: SqliteService, useClass: SqliteService},
    Facebook,
    NativeStorage,
    InAppBrowser,
    InAppPurchase,
    Network,
    SQLite,
    SQLitePorter,
    LocalNotifications,
    BackgroundMode
  ]
})
export class AppModule {}
