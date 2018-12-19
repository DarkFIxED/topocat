import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageBusService } from './message-bus/message-bus.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    providers: [MessageBusService]
})
export class InfrastructureModule {
}
