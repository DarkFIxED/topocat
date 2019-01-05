import { Component } from '@angular/core';
import { ListenerPriority, MessageBusService } from 'litebus';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private messageBus: MessageBusService) {
        // this.messageBus.listenAll((observable) => {
        //     return observable.subscribe(message => console.log(message));
        // }, ListenerPriority.High);
    }
}
