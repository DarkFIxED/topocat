import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { MessageBusService } from 'litebus';

const routes: Routes = [
    {
        path: '',
        loadChildren: './authorized/authorized.module#AuthorizedModule'
    }
];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes),

        InfrastructureModule,
    ],
    providers: [
        { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
        MessageBusService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
