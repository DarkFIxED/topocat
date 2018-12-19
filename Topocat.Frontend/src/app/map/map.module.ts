import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { RouterModule, Routes } from '@angular/router';
import { GoogleMapComponent } from './components/google-map/google-map.component';

const appRoutes: Routes = [
    {path: 'google', component: GoogleMapComponent},
    {path: '', redirectTo: 'google', pathMatch: 'full'}
];

@NgModule({
    imports: [
        CommonModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAebw5TL31hJwRaHbV-mmJR94EKReGVTS8'
        }),
        RouterModule.forChild(appRoutes)
    ],
    declarations: [GoogleMapComponent],
    exports: [RouterModule],
    providers: []
})
export class MapModule {
}
