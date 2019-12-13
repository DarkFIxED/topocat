import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthorizedLayoutComponent} from '../auth-core/components/authorized-layout/authorized-layout.component';
import {MapComponent} from './components/map/map.component';
import {AuthCoreModule} from '../auth-core/auth-core.module';
import {CoreModule} from '../core/core.module';
import {MapObjectsStore} from './stores/map-objects.store';
import {MapStore} from './stores/map.store';
import {MapObjectsService} from './services/map-objects.service';
import {MapsHttpService} from '../auth-core/services/maps.http.service';
import {MapObjectsQuery} from './queries/map-objects.query';
import {ObjectsListComponent} from './components/objects-list/objects-list.component';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatRadioModule,
    MatRippleModule,
    MatTabsModule, MatTooltipModule
} from '@angular/material';
import {ObjectsListItemComponent} from './components/objects-list-item/objects-list-item.component';
import {WktService} from './services/wkt.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MapsSignalRService} from './services/maps.signal-r.service';
import {EditMapObjectComponent} from './dialogs/edit-map-object/edit-map-object.component';
import {MapQuery} from './queries/map.query';
import {ConfirmDrawingComponent} from './components/confirm-drawing/confirm-drawing.component';
import {SelectNewObjectTypeComponent} from './dialogs/select-new-object-type/select-new-object-type.component';
import {MenuComponent} from './components/menu/menu.component';
import {MapsSettingsComponent} from './components/maps-settings/maps-settings.component';
import {MapObjectPropertiesComponent} from './dialogs/map-object-properties/map-object-properties.component';
import {FileListModule} from '../custom-components/file-list/file-list.module';
import {MapObjectAttachmentsHttpService} from './services/map-object-attachments.http.service';
import {GeneralMapObjectPropertiesComponent} from './components/general-map-object-properties/general-map-object-properties.component';
import {AttachmentsMapObjectPropertiesComponent} from './components/attachments-map-object-properties/attachments-map-object-properties.component';
import {MapService} from './services/map.service';
import {MapProvidersHttpService} from './services/map-providers.http.service';
import {CanUseMapProviderGuard} from './guards/can-use-map-provider.guard';

const routes: Routes = [
    {
        path: '',
        component: AuthorizedLayoutComponent,
        children: [
            {
                path: ':id',
                component: MapComponent,
                children: [
                    {
                        path: 'google',
                        loadChildren: './../google-provider/google-provider.module#GoogleProviderModule',
                        canLoad: [CanUseMapProviderGuard],
                        data: {
                            providerName: 'google'
                        }
                    },
                    {
                        path: 'yandex',
                        loadChildren: './../yandex-provider/yandex-provider.module#YandexProviderModule',
                        canLoad: [CanUseMapProviderGuard],
                        data: {
                            providerName: 'yandex'
                        }
                    }
                ]
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
        MapsSettingsComponent,
        MapObjectPropertiesComponent,
        GeneralMapObjectPropertiesComponent,
        AttachmentsMapObjectPropertiesComponent,
    ],
    imports: [
        CommonModule,
        AuthCoreModule,
        CoreModule,
        RouterModule.forChild(routes),
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
        FileListModule,
        MatChipsModule,
        MatIconModule,
        MatAutocompleteModule,
        MatTooltipModule
    ],
    entryComponents: [
        EditMapObjectComponent,
        SelectNewObjectTypeComponent,
        MapObjectPropertiesComponent
    ],
    providers: [
        MapObjectsStore,
        MapStore,
        MapObjectsService,
        MapService,
        MapsHttpService,
        MapObjectAttachmentsHttpService,
        MapObjectsQuery,
        WktService,
        MapsSignalRService,
        MapQuery,
        MapProvidersHttpService,
        CanUseMapProviderGuard
    ]
})
export class MapsModule {
    constructor(private signalRService: MapsSignalRService) {
        this.signalRService.startConnection();
    }
}
