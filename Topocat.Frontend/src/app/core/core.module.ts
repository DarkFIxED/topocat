import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {UnauthorizedLayoutComponent} from './components/unauthorized-layout/unauthorized-layout.component';
import {MatButtonModule, MatCardModule, MatDialogModule, MatIconRegistry, MatInputModule, MatToolbarModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import {DomSanitizer} from '@angular/platform-browser';
import { IndexComponent } from './components/index/index.component';
import { RestorePasswordComponent } from './components/restore-password/restore-password.component';
import { ConfirmationComponent } from './dialogs/confirmation/confirmation.component';

@NgModule({
    declarations: [
        UnauthorizedLayoutComponent,
        LoginComponent,
        ForgotPasswordComponent,
        IndexComponent,
        RestorePasswordComponent,
        ConfirmationComponent
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
        MatDialogModule
    ],
    entryComponents: [
        ConfirmationComponent
    ]
})
export class CoreModule {
    constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer){
        matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg')); // Or whatever path you placed mdi.svg at
    }
}
