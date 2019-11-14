export class DialogResult<T> {

    static Cancel<T>(): DialogResult<T> {
        return new DialogResult(true, false, undefined);
    }

    static Interrupt<T>(): DialogResult<T> {
        return new DialogResult(false, true, undefined);
    }

    static Ok<T>(data: T): DialogResult<T> {
        return new DialogResult(false, false, data);
    }

    constructor(public isCancelled,
                public isInterrupted,
                public data: T) {
    }
}
