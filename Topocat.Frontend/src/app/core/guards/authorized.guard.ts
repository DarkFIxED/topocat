import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {CredentialsStore} from '../stores/credentials.store';
import {TokensService} from '../services/tokens.service';

@Injectable({providedIn: 'root'})
export class AuthorizedGuard implements CanActivate, CanLoad {

    constructor(private credentialsStore: CredentialsStore,
                private tokensService: TokensService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.check();
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this.check();
    }

    private check() {
        const pair = this.credentialsStore.tokenPair;
        if (!pair || this.tokensService.isTokenExpired(pair.refreshToken)) {
            this.router.navigateByUrl('/login');
            return false;
        }

        return true;
    }
}
