import { Message } from './message';

export class SimpleMessage extends Message<any> {
    constructor(name: string,
                payload: any) {
        super(name, payload);
    }
}