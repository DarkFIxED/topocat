import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Listener } from './listener';
import { Message } from './message';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable()
export class MessageBusService {

    private listeners: Listener[] = [];

    public listen(eventTypes: string[], subscriptionFunc: (observable: Observable<Message>) => Subscription, priority: number = 3): string {
        let listener = new Listener(eventTypes, subscriptionFunc, priority);
        this.listeners.push(listener);

        return listener.id;
    };

    public stopListen(listenerIds: string[]) {
        let listeners = this.listeners.filter(x => listenerIds.some(y => y === x.id));

        for (let listener of listeners) {
            let index = this.listeners.indexOf(listener);

            listener.subscription.unsubscribe();
            this.listeners.splice(index, 1);
        }
    }

    public publish(message: Message) {
        let relevantListeners = this.listeners.filter(x => x.eventTypes.some(x => x === message.name));
        relevantListeners = relevantListeners.sort((listenerA, listenerB) => listenerA.priority - listenerB.priority);

        for (let listener of relevantListeners) {
            if (message.isRejected) {
                break;
            }

            listener.handle(message);
        }
    }
}
