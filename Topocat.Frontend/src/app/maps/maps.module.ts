import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthorizedLayoutComponent} from '../auth-core/components/authorized-layout/authorized-layout.component';
import {MapComponent} from './components/map/map.component';
import {AuthCoreModule} from '../auth-core/auth-core.module';
import {CoreModule} from '../core/core.module';
import {MapObjectsStore} from './stores/map-objects.store';
import {MapStore} from './stores/map.store';
import {MapService} from './services/map.service';
import {MapsHttpService} from '../auth-core/services/maps.http.service';
import {AgmCoreModule} from '@agm/core';
import {secrets} from '../../environments/secrets';
import {MapObjectsQuery} from './queries/map-objects.query';
import {ObjectsListComponent} from './components/objects-list/objects-list.component';
import {MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatListModule, MatRadioModule, MatRippleModule, MatTabsModule} from '@angular/material';
import {ObjectsListItemComponent} from './components/objects-list-item/objects-list-item.component';
import {WktService} from './services/wkt.service';
import {UnifiedMapObjectsFactory} from './models/unified-map-objects.factory';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MapsSignalRService} from './services/maps.signal-r.service';
import {EditMapObjectComponent} from './dialogs/edit-map-object/edit-map-object.component';
import {MapQuery} from './queries/map.query';
import { ConfirmDrawingComponent } from './components/confirm-drawing/confirm-drawing.component';
import { SelectNewObjectTypeComponent } from './dialogs/select-new-object-type/select-new-object-type.component';
import { MenuComponent } from './components/menu/menu.component';
import { MapsSettingsComponent } from './components/maps-settings/maps-settings.component';

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
    declarations: [
        MapComponent,
        ObjectsListComponent,
        ObjectsListItemComponent,
        EditMapObjectComponent,
        ConfirmDrawingComponent,
        SelectNewObjectTypeComponent,
        MenuComponent,
        MapsSettingsComponent
    ],
    imports: [
        CommonModule,
        AuthCoreModule,
        CoreModule,
        RouterModule.forChild(routes),
        AgmCoreModule.forRoot({
            apiKey: secrets.googleMapsApi,
            libraries: [
                'drawing'
            ]
        }),
        MatCardModule,
        MatListModule,
        MatButtonModule,
        MatRippleModule,
        MatInputModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatTabsModule,
    ],
    entryComponents: [
        EditMapObjectComponent,
        SelectNewObjectTypeComponent
    ],
    providers: [
        MapObjectsStore,
        MapStore,
        MapService,
        MapsHttpService,
        MapObjectsQuery,
        WktService,
        UnifiedMapObjectsFactory,
        MapsSignalRService,
        MapQuery
    ]
})
export class MapsModule {
    constructor(private signalRService: MapsSignalRService) {
        this.signalRService.startConnection();
    }
}
