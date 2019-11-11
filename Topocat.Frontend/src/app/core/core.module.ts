import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {UnauthorizedLayoutComponent} from './components/unauthorized-layout/unauthorized-layout.component';
import {MatButtonModule, MatCardModule, MatIconRegistry, MatInputModule, MatToolbarModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import {DomSanitizer} from '@angular/platform-browser';
import {AuthHttpService} from './services/auth.http.service';
import {BaseHttpService} from './services/base.http.service';
import { IndexComponent } from './components/index/index.component';

@NgModule({
    declarations: [
        UnauthorizedLayoutComponent,
        LoginComponent,
        ForgotPasswordComponent,
        IndexComponent
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
        MatInputModule
    ]
})
export class CoreModule {
    constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer){
        matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg')); // Or whatever path you placed mdi.svg at
    }
}
