import { Coords } from '../../domain/map/coords';

export class PhantomAreaPathChangedEventArgs {
    public constructor(public uuid: string,
                       public path: Coords[]){
    }
}