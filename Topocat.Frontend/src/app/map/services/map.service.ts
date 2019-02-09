import { Injectable } from '@angular/core';
import { MapProvider } from '../map-providers/map-provider';

@Injectable()
export class MapService {

    protected activatedProvider: MapProvider = undefined;

    get provider(): MapProvider {
        return this.activatedProvider;
    }

    get hasProvider(): boolean {
        return !!this.activatedProvider;
    }

    constructor() {
    }

    register(provider: MapProvider): void {
        if (!!this.activatedProvider) {
            throw new Error('MapProvider already registered. Try to unregister first');
        }

        this.activatedProvider = provider;
    }

    unregister(provider: MapProvider): void {
        if (this.activatedProvider !== provider) {
            throw new Error('MapProvider has not been registered.');
        }

        this.activatedProvider = undefined;
    }
}
