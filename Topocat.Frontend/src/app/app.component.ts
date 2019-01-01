import { Component } from '@angular/core';
import { MessageBusService } from './infrastructure/message-bus/message-bus.service';
import { MessagePriority } from './infrastructure/message-bus/message-priority';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private messageBus: MessageBusService) {
        this.messageBus.listenAll((observable) => {
            return observable.subscribe(message => console.log(message));
        }, MessagePriority.High);
    }
}
