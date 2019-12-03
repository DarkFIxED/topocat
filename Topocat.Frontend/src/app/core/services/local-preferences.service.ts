import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalPreferencesService {

    getValue(key: string): string {
        const rawValue = localStorage.getItem(key);
        if (!rawValue) {
            return rawValue;
        }

        return JSON.parse(rawValue).value;
    }

    setValue(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify({
            value
        }));
    }
}
