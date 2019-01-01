import { Coords } from '../coords';

export class CenterChangedEventArgs {
    public constructor(public center: Coords,
                       public setFromMap: boolean) {

    }
}