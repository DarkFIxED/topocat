import {Injectable} from '@angular/core';
import {MapStore} from '../stores/map.store';
import {MapsHttpService} from '../../auth-core/services/maps.http.service';
import {tap} from 'rxjs/operators';

@Injectable()
export class MapService {
    constructor(private mapStore: MapStore,
                private mapsHttpService: MapsHttpService) {
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
