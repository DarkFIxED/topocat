import {Component, OnInit} from '@angular/core';
import {CredentialsStore} from '../../../core/stores/credentials.store';
import {Router} from '@angular/router';

@Component({
    selector: 'app-authorized-layout',
    templateUrl: './authorized-layout.component.html',
    styleUrls: ['./authorized-layout.component.scss']
})
export class AuthorizedLayoutComponent implements OnInit {

    constructor(private credentialsStore: CredentialsStore,
                private router: Router) {
    }

    ngOnInit() {
    }

    logout() {
        this.credentialsStore.clear();
        this.router.navigateByUrl('login');
    }
}
