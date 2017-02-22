import { Component, OnInit, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, AngularFireAuth } from 'angularfire2';
import { Subject } from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  questions: FirebaseListObservable<any[]>;
  users: FirebaseListObservable<any[]>;
  polls: FirebaseListObservable<any[]>;
  auth;

  constructor(public af: AngularFire, @Inject('authData') auth ) {
    //this.questions = af.database.list('/questions')
    this.auth = auth;
   }

  ngOnInit() {
    //subscribe to userdata from auth.service
    this.auth.auth$.subscribe(authState => {
      console.log('AuthState: '+ authState);
    })
    this.initQuestions()
    this.getUsers()
    this.initPolls()
  }
    newPoll(title, client ,type, prompt, label1, label2, pagesource, css) {
      var label;
        this.polls.push({
          title: title,
          clientID: client,
          ownerID: this.auth.displayUID(),
          ownerName: this.auth.displayName(),
          type: type,
          prompt: prompt,
          label: label1 + " " + label2,
          pagesource: pagesource,
          css: css
        });
    }
    delete(key) {
      this.polls.remove(key)
    }
    initQuestions(){
      this.questions = this.af.database.list('/questions',{
//        query: {
//          orderByChild: 'ownerID',
//          equalTo: ''
//        }
      });
    }
    getUsers(){
      this.users = this.af.database.list('/users');
      console.log('GET USERS')
    }
    initPolls(){
      this.polls = this.af.database.list('/polls');
    }
    addUserData(clientID, questOwned){
      this.users.update(this.auth.displayUID(),{
        clientID: clientID,
        qowned: questOwned
      })
    }
    testDrop(value){
      console.log(value);
    }
    makePoll(clientID, questionID){
      console.log(clientID);
      console.log(questionID);
      this.polls.push({
        ownerID: this.auth.displayUID(),
        clientID: clientID,
        questionID: questionID
      })
    }
  }
