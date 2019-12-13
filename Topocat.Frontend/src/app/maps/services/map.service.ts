import {Injectable} from '@angular/core';
import {MapStore} from '../stores/map.store';
import {MapsHttpService} from '../../auth-core/services/maps.http.service';
import {tap} from 'rxjs/operators';
import {MapProvidersHttpService} from './map-providers.http.service';

@Injectable()
export class MapService {
    constructor(private mapStore: MapStore,
                private mapsHttpService: MapsHttpService,
                private mapProvidersHttpService: MapProvidersHttpService) {
    }

    load(mapId: string) {
        this.mapStore.setLoading(true);

        this.mapsHttpService.getMap(mapId)
            .pipe(
                tap(() => this.mapStore.setLoading(false)),
                tap(result => {
                    if (!result.isSuccessful) {
                        throw new Error();
                    }
                })
            )
            .subscribe(result => {
                this.mapStore.set([result.data.map]);
            });

        this.mapProvidersHttpService.getAvailableProviders()
            .pipe(
                tap(result => {
                    if (!result.isSuccessful)
                        throw new Error();
                }),
                tap(result => {
                    this.mapStore.update({
                        providers: result.data.providers
                    });
                })
            ).subscribe();
    }

    reset() {
        this.mapStore.reset();
        this.mapStore.set([]);
    }

    setMapPosition(lat: number, lng: number, zoom?: number, setAsManually = true) {
        const currentZoom = this.mapStore.getValue().position.zoom;

        const newPosition = {
            position: {
                lat,
                lng,
                zoom: !!zoom ? zoom : currentZoom,
                setManually: setAsManually
            }
        };
        this.mapStore.update(newPosition);
    }

    setMapMode(mode: string) {
        this.mapStore.update({
            mapMode: mode
        });
    }

}
