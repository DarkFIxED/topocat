import {Injectable} from '@angular/core';
import {TokenPair} from '../models/token-pair';
import {JwtTokensService} from '../services/jwt-tokens.service';

@Injectable({
    providedIn: 'root'
})
export class CredentialsStore {
    private readonly storageKey = 'Credentials';

    private currentTokenPair: TokenPair = undefined;

    public get tokenPair(): TokenPair {
        return this.currentTokenPair;
    }

    constructor(private jwtTokensService: JwtTokensService) {
        this.currentTokenPair = this.load();
    }

    updateTokenPair(tokenPair: TokenPair) {
        this.save(tokenPair);
        this.currentTokenPair = tokenPair;
    }

    clear() {
        localStorage.removeItem(this.storageKey);
    }

    getCurrentUserId(): string {
        const tokenPair = this.tokenPair;
        if (!tokenPair || !tokenPair.accessToken)
            return undefined;

        return this.jwtTokensService.getUserId(tokenPair.accessToken);
    }

    private save(tokenPair: TokenPair) {
        localStorage.setItem(this.storageKey, JSON.stringify(tokenPair));
    }

    private load(): TokenPair {
        const rawData = localStorage.getItem(this.storageKey);
        if (!rawData) {
            return undefined;
        }

        return JSON.parse(rawData);
    }
}
