import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapsListComponent} from './components/maps-list/maps-list.component';
import {AuthCoreModule} from '../auth-core/auth-core.module';
import {RouterModule, Routes} from '@angular/router';
import {AuthorizedLayoutComponent} from '../auth-core/components/authorized-layout/authorized-layout.component';
import {MatButtonModule, MatCardModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatProgressSpinnerModule, MatTableModule} from '@angular/material';
import {CoreModule} from '../core/core.module';
import {MapsListHttpService} from './services/maps-list.http.service';
import {HttpClientModule} from '@angular/common/http';
import { NewMapComponent } from './components/new-map/new-map.component';
import {ReactiveFormsModule} from '@angular/forms';


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
    declarations: [MapsListComponent, NewMapComponent],
    imports: [
        CoreModule,
        AuthCoreModule,
        CommonModule,
        MatButtonModule,
        RouterModule.forChild(routes),
        MatCardModule,
        MatTableModule,
        HttpClientModule,
        MatIconModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatInputModule
    ],
    entryComponents: [NewMapComponent],
    providers: [MapsListHttpService],
    exports: [RouterModule]
})
export class MapsListModule {
}
