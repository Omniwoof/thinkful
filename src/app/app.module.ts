import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { AuthService } from './auth.service';
import { AuthComponent } from './auth/auth.component';
import { PollComponent } from './poll/poll.component';
import { InviteComponent } from './invite/invite.component';
import { MakepollComponent } from './makepoll/makepoll.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NewPollComponent } from './new-poll/new-poll.component';
import { MaterialModule } from '@angular/material';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ChartDirective } from './chart.directive';
import { ChartComponent } from './chart/chart.component';

// Must export firebase config
export const firebaseConfig = {
  apiKey: 'AIzaSyCDwMv5iGFH-ZNDKdWcH8MmPO4KYjPOslM',
  authDomain: 'thinkfulapi.firebaseapp.com',
  databaseURL: 'https://thinkfulapi.firebaseio.com',
  storageBucket: 'thinkfulapi.appspot.com',
  messagingSenderId: '606636155183'
};

const appRoutes: Routes = [

  { path: 'invite/:id', component: InviteComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    PollComponent,
    InviteComponent,
    InviteComponent,
    MakepollComponent,
    NewPollComponent,
    ChartDirective,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(firebaseConfig),
    ReactiveFormsModule,
    MaterialModule,
    Ng2GoogleChartsModule
  ],
  providers: [{provide:'authData', useClass: AuthService}],
  bootstrap: [AppComponent]
})
export class AppModule { }
