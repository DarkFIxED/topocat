import {DataFlow} from '../../core/services/data.flow';
import {Router} from '@angular/router';
import {MapsSignalRService} from '../services/maps.signal-r.service';
import {Injectable} from '@angular/core';
import {BaseDestroyable} from '../../core/services/base-destroyable';
import {takeUntil, tap} from 'rxjs/operators';

@Injectable()
export class MapRemovedFlow extends BaseDestroyable implements DataFlow {
    constructor(private router: Router,
                private mapsSignalRService: MapsSignalRService) {
        super();
    }

    setUp() {
        this.mapsSignalRService.mapRemoved$.pipe(
            tap(() => this.router.navigateByUrl('/message', {
                state: {
                    message: 'Current map removed.',
                    redirectUrl: '/maps-list'
                }
            })),
            takeUntil(this.componentAlive$)
        ).subscribe();
    }
}
