import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { RouterModule, Routes } from '@angular/router';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { environment } from '../../environments/environment';
import { ControlToolbarComponent } from './components/control-toolbar/control-toolbar.component';
import { MatButtonModule, MatCardModule, MatDividerModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { DomainModule } from '../domain/domain.module';
import { MapStore } from './stores/map.store';
import { ReactiveFormsModule } from '@angular/forms';

const appRoutes: Routes = [
    {path: 'google', component: GoogleMapComponent},
    {path: '', redirectTo: 'google', pathMatch: 'full'}
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
        MatInputModule
    ],
    declarations: [GoogleMapComponent, ControlToolbarComponent],
    exports: [RouterModule],
    providers: [MapStore]
})
export class MapModule {
}
