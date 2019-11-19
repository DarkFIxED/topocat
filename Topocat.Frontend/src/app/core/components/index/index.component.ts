import {Component, OnInit} from '@angular/core';
import {CredentialsStore} from '../../stores/credentials.store';
import {TokensService} from '../../services/tokens.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

    constructor(private credentialsStore: CredentialsStore,
                private tokensService: TokensService,
                private router: Router) {
    }

    ngOnInit(): void {
        if (this.isAuthenticated()) {
            this.router.navigateByUrl('/maps-list');
        }
    }

    private isAuthenticated() {
        const tokenPair = this.credentialsStore.tokenPair;
        if (!tokenPair) {
            return false;
        }

        return !this.tokensService.isTokenExpired(tokenPair.refreshToken);
    }

}
