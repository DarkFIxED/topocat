import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
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
    ],
    providers: [
        // Dirty hack to use yandex maps in lazy module.
        // Providing stub value.
        { provide: 'API_KEY', useValue: secrets.yandexMapsApi }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
