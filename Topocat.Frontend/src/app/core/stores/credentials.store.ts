import {Injectable} from '@angular/core';
import {TokenPair} from '../models/token-pair';

@Injectable({
    providedIn: 'root'
})
export class CredentialsStore {
    private readonly storageKey = 'Credentials';

    private currentTokenPair: TokenPair = undefined;

    public get tokenPair(): TokenPair {
        return this.currentTokenPair;
    }

    constructor() {
        this.currentTokenPair = this.load();
    }

    updateTokenPair(tokenPair: TokenPair) {
        this.save(tokenPair);
        this.currentTokenPair = tokenPair;
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
