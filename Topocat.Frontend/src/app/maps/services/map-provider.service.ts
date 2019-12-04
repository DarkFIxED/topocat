import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MapProvider} from '../providers/map-provider';
import {filter} from 'rxjs/operators';

@Injectable()
export class MapProviderService {

    private provider = new BehaviorSubject<MapProvider>(undefined);
    provider$ = this.provider.asObservable().pipe(
        filter(value => !!value)
    );

    setProvider(provider: MapProvider) {
        this.provider.next(provider);
    }

    getProvider(): MapProvider {
        return this.provider.getValue();
    }
}
