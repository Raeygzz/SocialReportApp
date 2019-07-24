import { Component } from '@angular/core';
import { ModalController, ViewController } from 'ionic-angular';

@Component({
  selector: 'modal-content',
  templateUrl: 'modal-content.html'
})
export class ModalContentComponent {
  
  constructor(public viewCtrl: ViewController) {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
