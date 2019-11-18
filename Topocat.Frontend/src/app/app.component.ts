import {Component, NgZone, OnInit} from '@angular/core';
import {environment} from '../environments/environment';
import {akitaDevtools} from '@datorama/akita';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private ngZone: NgZone) {
        if (!environment.production) {
            akitaDevtools(ngZone);
        }
    }

    ngOnInit(): void {
    }
}
