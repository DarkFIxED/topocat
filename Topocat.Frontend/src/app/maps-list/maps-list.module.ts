import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapsListComponent} from './components/maps-list/maps-list.component';
import {AuthCoreModule} from '../auth-core/auth-core.module';
import {RouterModule, Routes} from '@angular/router';
import {AuthorizedLayoutComponent} from '../auth-core/components/authorized-layout/authorized-layout.component';
import {MatButtonModule} from '@angular/material';
import {CoreModule} from '../core/core.module';


const routes: Routes = [
    {
        path: '',
        component: AuthorizedLayoutComponent,
        children: [
            {
                path: '',
                component: MapsListComponent
            }
        ]
    }
];

@NgModule({
    declarations: [MapsListComponent],
    imports: [
        CoreModule,
        AuthCoreModule,
        CommonModule,
        MatButtonModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class MapsListModule {
}
