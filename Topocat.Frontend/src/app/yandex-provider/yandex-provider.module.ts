import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {YandexMapContainerComponent} from './components/yandex-map-container/yandex-map-container.component';
import {AngularYandexMapsModule} from 'angular8-yandex-maps';
import {secrets} from '../../environments/secrets';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: YandexMapContainerComponent,
    }
];

@NgModule({
    declarations: [
        YandexMapContainerComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        AngularYandexMapsModule.forRoot(secrets.yandexMapsApi),
    ]
})
export class YandexProviderModule {
}
