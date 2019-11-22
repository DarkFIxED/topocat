import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule, MatIconModule, MatSidenavModule, MatToolbarModule} from '@angular/material';
import {AuthorizedLayoutComponent} from './components/authorized-layout/authorized-layout.component';
import {CoreModule} from '../core/core.module';
import {RouterModule} from '@angular/router';
import {MapsHttpService} from './services/maps.http.service';


@NgModule({
    declarations: [AuthorizedLayoutComponent],
    imports: [
        CommonModule,
        CoreModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        RouterModule
    ],
    providers: [
        MapsHttpService
    ]
})
export class AuthCoreModule {
}
