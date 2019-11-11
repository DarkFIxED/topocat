import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthorizedGuard} from './core/guards/authorized.guard';
import {UnauthorizedLayoutComponent} from './core/components/unauthorized-layout/unauthorized-layout.component';
import {LoginComponent} from './core/components/login/login.component';
import {ForgotPasswordComponent} from './core/components/forgot-password/forgot-password.component';
import {IndexComponent} from './core/components/index/index.component';


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
                path: 'forgot-password',
                component: ForgotPasswordComponent
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
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
