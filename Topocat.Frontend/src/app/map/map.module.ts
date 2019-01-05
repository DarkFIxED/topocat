import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSliderModule
} from '@angular/material';
import { DomainModule } from '../domain/domain.module';
import { MapStore } from './stores/map.store';
import { MapComponent } from './components/map/map.component';
import { environment } from '../../environments/environment';
import { ControlToolbarComponent } from './components/control-toolbar/control-toolbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MapService } from './services/map.service';
import { EditPlaceComponent } from './components/edit-place/edit-place.component';

const appRoutes: Routes = [
    {
        path: '',
        component: MapComponent,
        children: [
            {
                path: 'places/new',
                component: EditPlaceComponent
            }
        ]
    },
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DomainModule,
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
        MatIconModule
    ],
    declarations: [
        MapComponent,
        ControlToolbarComponent,
        EditPlaceComponent
    ],
    exports: [RouterModule],
    providers: [MapStore, MapService]
})
export class MapModule {
}
