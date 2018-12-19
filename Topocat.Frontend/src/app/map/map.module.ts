import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { RouterModule, Routes } from '@angular/router';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { environment } from '../../environments/environment';

const appRoutes: Routes = [
    {path: 'google', component: GoogleMapComponent},
    {path: '', redirectTo: 'google', pathMatch: 'full'}
];

@NgModule({
    imports: [
        CommonModule,
        AgmCoreModule.forRoot({
            apiKey: environment.googleMapsApiKey
        }),
        RouterModule.forChild(appRoutes)
    ],
    declarations: [GoogleMapComponent],
    exports: [RouterModule],
    providers: []
})
export class MapModule {
}
