import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { MainComponent } from './main.component';
import { MpcComponent } from './mpc.component';
import { ApiService } from './services/api-service';

const appRoutes: Routes = [
  { path: 'main', component: MainComponent },
  { path: 'mpc', component: MpcComponent },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: '**', component: MainComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MpcComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    FormsModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
