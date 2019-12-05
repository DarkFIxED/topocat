import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularYandexMapsModule} from 'angular8-yandex-maps';
import {secrets} from '../environments/secrets';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        CoreModule,
        BrowserAnimationsModule,
        AngularYandexMapsModule.forRoot(secrets.yandexMapsApi),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
