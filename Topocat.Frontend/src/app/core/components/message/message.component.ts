import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

    message = '';

    redirectUrl = '/';

    constructor(private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.paramMap
            .pipe(
                map(() => window.history.state)
            ).subscribe(state => {
            this.message = state.text;
            this.redirectUrl = state.redirectUrl;
        });

        setTimeout(() => {
            this.router.navigateByUrl(this.redirectUrl);
        }, 5000);
    }

}
