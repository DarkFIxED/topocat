export class PhantomPlaceCoordsChangedEventArgs {
    public constructor(public uuid: string,
                       public lat: number,
                       public lng: number) {
    }
}