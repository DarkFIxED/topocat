import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageBusService } from './message-bus/message-bus.service';
import { JsonDeserializer } from './json-deserializer';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    providers: [
        MessageBusService,
        JsonDeserializer
    ]
})
export class InfrastructureModule {
}
