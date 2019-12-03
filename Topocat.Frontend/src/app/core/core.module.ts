import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {UnauthorizedLayoutComponent} from './components/unauthorized-layout/unauthorized-layout.component';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatButtonModule, MatCardModule, MatDialogModule, MatIconRegistry, MatInputModule, MatRadioModule, MatToolbarModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {DomSanitizer} from '@angular/platform-browser';
import {IndexComponent} from './components/index/index.component';
import {RestorePasswordComponent} from './components/restore-password/restore-password.component';
import {ConfirmationComponent} from './dialogs/confirmation/confirmation.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {LoaderComponent} from './components/loader/loader.component';
import {AboutComponent} from './components/about/about.component';
import {AcceptInviteComponent} from './components/accept-invite/accept-invite.component';
import { MessageComponent } from './components/message/message.component';
import {SuppressNullPipe} from './pipes/suppress-null.pipe';

@NgModule({
    declarations: [
        UnauthorizedLayoutComponent,
        LoginComponent,
        ForgotPasswordComponent,
        IndexComponent,
        RestorePasswordComponent,
        ConfirmationComponent,
        SignUpComponent,
        LoaderComponent,
        AboutComponent,
        AcceptInviteComponent,
        MessageComponent,
        SuppressNullPipe
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        MatToolbarModule,
        RouterModule,
        MatButtonModule,
        MatCardModule,

        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatDialogModule,
        MatRadioModule
    ],
    exports: [
        LoaderComponent
    ],
    entryComponents: [
        ConfirmationComponent
    ],
    providers: [
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {
                hasBackdrop: true,
                width: '450px',
                disableClose: true
            }
        },
        SuppressNullPipe
    ]
})
export class CoreModule {
    constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
        matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg')); // Or whatever path you placed mdi.svg at
    }
}
