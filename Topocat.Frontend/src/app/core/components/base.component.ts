import {OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

export class BaseComponent implements OnDestroy {

    private componentAlive = new Subject();
    protected componentAlive$ = this.componentAlive.asObservable();

    ngOnDestroy(): void {
        this.componentAlive.next();
        this.componentAlive.complete();
    }
}
