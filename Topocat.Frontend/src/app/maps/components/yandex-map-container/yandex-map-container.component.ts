import {Component, OnInit} from '@angular/core';
import {ILoadEvent} from 'angular8-yandex-maps/lib/types/types';

@Component({
    selector: 'app-yandex-map-container',
    templateUrl: './yandex-map-container.component.html',
    styleUrls: ['./yandex-map-container.component.scss']
})
export class YandexMapContainerComponent implements OnInit {

    constructor() {
    }

    private static initialCustomization(map: any) {
        map.controls.remove('geolocationControl');
        map.controls.remove('searchControl');
        map.controls.remove('trafficControl');
        map.controls.remove('typeSelector');
        map.controls.remove('fullscreenControl');
        map.controls.remove('rulerControl');
        map.controls.remove('zoomControl');
    }

    ngOnInit() {
    }

    onMapLoaded(event: ILoadEvent) {
        YandexMapContainerComponent.initialCustomization(event.instance);
    }
}
