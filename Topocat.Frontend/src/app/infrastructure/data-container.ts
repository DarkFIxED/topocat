import { environment } from '../../environments/environment';

export class DataContainer<T> {
    public version: string = environment.apiProtocolVersion;

    constructor(public data: T) {
    }
}