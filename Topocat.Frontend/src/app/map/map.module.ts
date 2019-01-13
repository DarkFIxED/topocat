import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule,
    MatCardModule, MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSliderModule,
    MatTabsModule
} from '@angular/material';
import { DomainModule } from '../domain/domain.module';
import { MapStore } from './stores/map.store';
import { MapComponent } from './components/map/map.component';
import { environment } from '../../environments/environment';
import { ControlToolbarComponent } from './components/control-toolbar/control-toolbar.component';
import { MapService } from './services/map.service';
import { EditPlaceComponent } from './components/edit-place/edit-place.component';
import { MapObjectsListComponent } from './components/map-objects-list/map-objects-list.component';
import { MainCardComponent } from './components/main-card/main-card.component';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { EditAreaComponent } from './components/edit-area/edit-area.component';

const appRoutes: Routes = [
    {
        path: 'main',
        component: MapComponent,
        children: [
            {
                path: 'items',
                component: MapObjectsListComponent,
            },
            {
                path: 'new-place',
                outlet: 'popups',
                data: {newEntity: true},
                component: EditPlaceComponent
            },
            {
                path: 'edit-place/:id',
                outlet: 'popups',
                data: {newEntity: false},
                component: EditPlaceComponent
            },
            {
                path: 'new-area',
                outlet: 'popups',
                data: {newEntity: true},
                component: EditPlaceComponent
            },
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'main'
    }
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DomainModule,
        InfrastructureModule,
        AgmCoreModule.forRoot({
            apiKey: environment.googleMapsApiKey,
            libraries: ['drawing']
        }),
        RouterModule.forChild(appRoutes),
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSliderModule,
        MatIconModule,
        MatListModule,
        MatTabsModule,
        MatDialogModule
    ],
    declarations: [
        MapComponent,
        ControlToolbarComponent,
        EditPlaceComponent,
        MapObjectsListComponent,
        MainCardComponent,
        EditAreaComponent
    ],
    exports: [RouterModule],
    providers: [MapStore, MapService]
})
export class MapModule {
}
