import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
    path: '',
    component: AuthLayoutComponent,
    children: [
        {
            path: 'map',
            loadChildren: './../map/map.module#MapModule'
        },
        {
            path: '',
            redirectTo: 'map',
            pathMatch: 'full'
        }
    ]
}];

@NgModule({
    declarations: [AuthLayoutComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatSidenavModule,
    ],
    exports: [
        RouterModule
    ]
})
export class AuthorizedModule {
}
