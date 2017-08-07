import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './auth.service';
import { PollComponent } from './poll/poll.component';
import { InviteComponent } from './invite/invite.component';
import { MakepollComponent } from './makepoll/makepoll.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NewPollComponent } from './new-poll/new-poll.component';
import { MaterialModule } from '@angular/material';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import * as firebase from 'firebase';
import { SendInviteComponent } from './send-invite/send-invite.component';
import { ChartComponent } from './chart/chart.component';
import { QuestionsComponent } from './questions/questions.component';

// Must export firebase config
export const firebaseConfig = {
  apiKey: 'AIzaSyCDwMv5iGFH-ZNDKdWcH8MmPO4KYjPOslM',
  authDomain: 'thinkfulapi.firebaseapp.com',
  databaseURL: 'https://thinkfulapi.firebaseio.com',
  storageBucket: 'thinkfulapi.appspot.com',
  messagingSenderId: '606636155183'
};

const appRoutes: Routes = [

  { path: 'invite/:id', component: InviteComponent },
  { path: 'newquestion', component: NewPollComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    PollComponent,
    InviteComponent,
    MakepollComponent,
    NewPollComponent,
    SendInviteComponent,
    //Delete these components and imports, only included because of ng build --prod
    ChartComponent,
    QuestionsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    MaterialModule,
    Ng2GoogleChartsModule
  ],
  // TODO: Probably should register auth.service here.
  // providers: [{provide:'authData', useClass: AuthService}],
  bootstrap: [AppComponent]
})
export class AppModule { }
