import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonDeserializer } from './json-deserializer';
import { MessageBusService } from 'litebus';

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
