// import { Store } from '../../infrastructure/store';
import { GoogleMapConfigurationModel } from '../models/google-map-configuration.model';
import { Injectable } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

@Injectable()
export class GoogleMapConfigurationStore {

    private readonly googleMapConfigKey = 'google-map-config';

    public constructor() {


        // this.modelChanged$.pipe(
        //     debounceTime(300)
        // ).subscribe(value => {
        //    let serializedModel = JSON.stringify(value);
        //    localStorage.setItem(this.googleMapConfigKey, serializedModel);
        // });

        this.loadConfiguration();
    }

    private loadConfiguration() {
        let serializedConfig = localStorage.getItem(this.googleMapConfigKey);
        //let config = !!serializedConfig ? JSON.parse(serializedConfig) : new GoogleMapConfigurationModel();

        // this.update(config);
    }

}