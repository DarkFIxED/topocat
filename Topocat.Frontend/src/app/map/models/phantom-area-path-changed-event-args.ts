import { Coords } from '../../domain/map/coords';

export class PhantomAreaPathChangedEventArgs {
    constructor(public uuid: string,
                       public path: Coords[]){
    }
}