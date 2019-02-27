import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { DisablecontrolDirective } from '../../directives/disablecontrol.directive';
import { GeneralConfirmationComponent } from './components/general-confirmation/general-confirmation.component';

@NgModule({
  declarations: [DisablecontrolDirective, GeneralConfirmationComponent],
  imports: [
    ModalModule.forRoot(),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      backdropBorderRadius: '4px',
      fullScreenBackdrop: false,
      primaryColour: '#ff3333',
      secondaryColour: '#ff3333',
      tertiaryColour: '#ff3333'
    })
  ],
  entryComponents: [
    GeneralConfirmationComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    NgxLoadingModule,
    DisablecontrolDirective,
    GeneralConfirmationComponent
  ]
})
export class SharedModule {

}
