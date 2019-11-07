import {Component, OnInit} from '@angular/core';
import {AuthHttpService} from './core/services/auth.http.service';
import {ApiResponse} from './core/models/api.response';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private authHttpService: AuthHttpService) {
    }

    title = 'topocat';

    ngOnInit(): void {
        //this.authHttpService.get<ApiResponse<any>>('map/ae94f6e5-76ec-4ed5-ba5b-36f36a148318').subscribe(result => console.log(result));
    }
}
