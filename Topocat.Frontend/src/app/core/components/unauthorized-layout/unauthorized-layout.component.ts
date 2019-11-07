import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-unauthorized-layout',
    templateUrl: './unauthorized-layout.component.html',
    styleUrls: ['./unauthorized-layout.component.scss']
})
export class UnauthorizedLayoutComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    goToLogin() {
        this.router.navigateByUrl('/login');
    }
}
