import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthorizedLayoutComponent} from '../auth-core/components/authorized-layout/authorized-layout.component';
import {MembershipListComponent} from '../maps-list/components/membership-list/membership-list.component';
import {MapsListComponent} from '../maps-list/components/maps-list/maps-list.component';
import {MapComponent} from './components/map/map.component';
import {AuthCoreModule} from '../auth-core/auth-core.module';
import {CoreModule} from '../core/core.module';
import {MapObjectsStore} from './stores/map-objects.store';
import {MapStore} from './stores/map.store';
import {MapService} from './services/map.service';
import {MapsHttpService} from './services/maps.http.service';
import {AgmCoreModule} from '@agm/core';
import {secrets} from '../../environments/secrets';

const routes: Routes = [
    {
        path: '',
        component: AuthorizedLayoutComponent,
        children: [
            {
                path: ':id',
                component: MapComponent
            }
        ]
    }
];

@NgModule({
    declarations: [MapComponent],
    imports: [
        CommonModule,
        AuthCoreModule,
        CoreModule,
        RouterModule.forChild(routes),
        AgmCoreModule.forRoot({
            apiKey: secrets.googleMapsApi
        })
    ],
    providers: [MapObjectsStore, MapStore, MapService, MapsHttpService]
})
export class MapsModule {
}
