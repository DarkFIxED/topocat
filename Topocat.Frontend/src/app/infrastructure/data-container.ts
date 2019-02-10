import { environment } from '../../environments/environment';

export class DataContainer<T> {
    version: string = environment.apiProtocolVersion;

    constructor(public data: T) {
    }
}