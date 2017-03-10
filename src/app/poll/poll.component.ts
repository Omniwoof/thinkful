import { Component, OnInit, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, AngularFireAuth } from 'angularfire2';
import { AuthService } from '../auth.service';
import {Observable, Subject, BehaviorSubject} from "rxjs/Rx";

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {
  users: FirebaseListObservable<any[]>;
  polls: FirebaseListObservable<any[]>;
  auth;

  constructor(public af: AngularFire, @Inject('authData') auth) { this.auth = auth; }

  ngOnInit() {
    //subscribe to userdata from auth.service
    this.auth.auth$.subscribe(authState => {
      console.log('AuthState: '+ authState);
      console.log(authState);
    })
    this.getUsers()
    this.initPolls()
  }
  newPoll(title, client ,type, prompt, label1, label2, pagesource, css) {
    let label = []
    label.push(label1, label2)
      this.polls.push({
        title: title,
        clientID: client,
        ownerID: this.auth.displayUID(),
        ownerName: this.auth.displayName(),
        type: type,
        prompt: prompt,
        label: label,
        pagesource: pagesource,
        css: css
      });
  }
  delete(key) {
    this.polls.remove(key)
  }

  getUsers(){
    this.users = this.af.database.list('/users');
  }
  initPolls(){
    this.polls = this.af.database.list('/polls');
  }
  addUserData(clientID, pollOwned){
    this.users.update(this.auth.displayUID(),{
      clientID: clientID,
      qowned: pollOwned
    })
  }
}
