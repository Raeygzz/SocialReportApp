import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
// import { InstagramHomePage } from '../instagram-home/instagram-home';
import { FacebookHomePage } from '../facebook-home/facebook-home';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  // tab1Root = InstagramHomePage;
  // tab2Root = FacebookHomePage;
  // tab3Root = SettingsPage;
  // tabIndex: number = 0;

  tab2Root = FacebookHomePage;
  tab3Root = SettingsPage;
  tabIndex: number = 0;

  constructor(private navParams: NavParams) {
    if (this.navParams.get("tab")) {
      if (this.navParams.get("tab") == 'facebook') {
        this.tabIndex = 1;
      }
      else {
        this.tabIndex = 0;
      }
    }
  }

  ionViewWillEnter() {

  }

}
