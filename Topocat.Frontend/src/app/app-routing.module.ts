import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthorizedGuard} from './core/guards/authorized.guard';
import {UnauthorizedLayoutComponent} from './core/components/unauthorized-layout/unauthorized-layout.component';
import {LoginComponent} from './core/components/login/login.component';
import {ForgotPasswordComponent} from './core/components/forgot-password/forgot-password.component';
import {IndexComponent} from './core/components/index/index.component';
import {RestorePasswordComponent} from './core/components/restore-password/restore-password.component';
import {SignUpComponent} from './core/components/sign-up/sign-up.component';


const routes: Routes = [
    {
        path: '',
        component: UnauthorizedLayoutComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'sign-up',
                component: SignUpComponent
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent
            },
            {
                path: 'restore-password',
                component: RestorePasswordComponent
            },
            {
                path: '',
                component: IndexComponent
            }
        ]
    },
    {
        path: 'maps-list',
        loadChildren: './maps-list/maps-list.module#MapsListModule',
        canLoad: [AuthorizedGuard],
        canActivate: [AuthorizedGuard]
    },
    {
        path: 'maps',
        loadChildren: './maps/maps.module#MapsModule',
        canLoad: [AuthorizedGuard],
        canActivate: [AuthorizedGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
