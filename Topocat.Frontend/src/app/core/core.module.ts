import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {UnauthorizedLayoutComponent} from './components/unauthorized-layout/unauthorized-layout.component';
import {MatButtonModule, MatCardModule, MatInputModule, MatToolbarModule} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [
    {
        path: '',
        component: UnauthorizedLayoutComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent
            }
        ]
    }
];

@NgModule({
    declarations: [UnauthorizedLayoutComponent, LoginComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        MatToolbarModule,
        RouterModule.forRoot(routes),
        MatButtonModule,
        MatCardModule,

        ReactiveFormsModule,
        FormsModule,
        MatInputModule
    ],
    exports: [
        RouterModule
    ]
})
export class CoreModule {
}
