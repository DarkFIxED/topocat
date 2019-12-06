import {Component, NgZone, OnInit} from '@angular/core';
import {ILoadEvent} from 'angular8-yandex-maps/lib/types/types';
import {MapProviderService} from '../../services/map-provider.service';
import {YandexMapProvider} from '../../providers/yandex/yandex-map-provider';
import {WktService} from '../../services/wkt.service';

@Component({
    selector: 'app-yandex-map-container',
    templateUrl: './yandex-map-container.component.html',
    styleUrls: ['./yandex-map-container.component.scss']
})
export class YandexMapContainerComponent implements OnInit {

    constructor(private mapProviderService: MapProviderService,
                private wktService: WktService,
                private zone: NgZone) {
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
        this.mapProviderService.setProvider(new YandexMapProvider(event.instance, this.wktService, this.zone));
    }
}
