import {OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

export class BaseDestroyable implements OnDestroy {

    private componentAlive = new Subject();
    protected componentAlive$ = this.componentAlive.asObservable();

    ngOnDestroy(): void {
        this.componentAlive.next();
        this.componentAlive.complete();
    }
}
