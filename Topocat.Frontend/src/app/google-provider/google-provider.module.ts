import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {GoogleMapContainerComponent} from './components/google-map-container/google-map-container.component';
import {AgmCoreModule} from '@agm/core';
import {secrets} from '../../environments/secrets';

const routes: Routes = [
    {
        path: '',
        component: GoogleMapContainerComponent,
    }
];

@NgModule({
    declarations: [
        GoogleMapContainerComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        AgmCoreModule.forRoot({
            apiKey: secrets.googleMapsApi,
            libraries: [
                'drawing'
            ]
        }),
    ]
})
export class GoogleProviderModule {
}
