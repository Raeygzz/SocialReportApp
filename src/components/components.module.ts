import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalContentComponent } from './modal-content/modal-content';
@NgModule({
	declarations: [ModalContentComponent],
	imports: [
		IonicPageModule.forChild(ModalContentComponent),
	],
	exports: [ModalContentComponent]
})
export class ComponentsModule {}
