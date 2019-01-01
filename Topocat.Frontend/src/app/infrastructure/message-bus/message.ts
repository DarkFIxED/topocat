export class Message<T> {
    public constructor(public name: string,
                       public payload: T) {
    }

    private _isRejected = false;

    public get isRejected(): boolean {
        return this._isRejected;
    }

    public reject() {
        this._isRejected = true;
    }
}
