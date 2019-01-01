import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

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
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
