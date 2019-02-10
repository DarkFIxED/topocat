import { Coords } from '../coords';

export class CenterChangedEventArgs {
    constructor(public center: Coords,
                public setFromMap: boolean) {
    }
}