import { Subscription } from 'rxjs/internal/Subscription';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';
import { UUID } from 'angular2-uuid';
import { Message } from './message';

export class Listener {
    public readonly id: string;
    public readonly eventTypes: string[];
    public readonly priority: number;
    public readonly subscription: Subscription;

    private readonly subject: Subject<Message>;
    public constructor(eventTypes: string[], subscriptionFunc: (observable: Observable<Message>) => Subscription, priority: number = 3) {
        this.id = UUID.UUID();
        this.eventTypes = [...eventTypes];
        this.priority = priority;
        this.subject = new Subject<Message>();

        this.subscription = subscriptionFunc(this.subject.asObservable());
    }

    public handle(message: Message): void {
        this.subject.next(message);
    }
}
