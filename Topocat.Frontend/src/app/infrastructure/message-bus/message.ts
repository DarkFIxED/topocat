export class Message {
    public constructor(public name: string,
                       public payload: any) {
    }

    private _isRejected = false;

    public get isRejected(): boolean {
        return this._isRejected;
    }

    public reject() {
        this._isRejected = true;
    }
}

export class TypedMessage<T> extends Message {
    public constructor(name: string,
                       payload: T){
        super(name, payload);
    }
}