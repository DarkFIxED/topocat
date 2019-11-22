import {Injectable} from '@angular/core';
import * as jwt_decode from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class JwtTokensService {
    public isTokenExpired(jwtToken: string): boolean {
        const claims = jwt_decode(jwtToken);
        const accessTokenExpiration = claims.exp * 1000;

        return new Date().getTime() > accessTokenExpiration;
    }

    public getUserId(jwtToken: string): string {
        const claims = jwt_decode(jwtToken);
        return claims.sid;
    }
}
