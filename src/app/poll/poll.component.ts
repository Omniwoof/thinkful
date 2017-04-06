import { Component, OnInit, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, AngularFireAuth } from 'angularfire2';
import { AuthService } from '../auth.service';
import {Observable, Subject, BehaviorSubject} from "rxjs/Rx";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {
  users: FirebaseListObservable<any[]>;
  polls: FirebaseListObservable<any[]>;
  results: FirebaseListObservable<any[]>;
  currentPoll;
  result: FormGroup;
  auth;
  currentTime;

  constructor(private fb: FormBuilder,
    public af: AngularFire,
    @Inject('authData') auth) { this.auth = auth; }

  ngOnInit() {
    //subscribe to userdata from auth.service
    this.auth.auth$.subscribe(authState => {
      console.log('AuthState: '+ authState);
      console.log(authState);
    })
    this.getUsers()
    this.initPolls()
    this.initResults()
  }
  delete(key) {
    this.polls.remove(key)
  }
  deleteResult(key){
    this.results.remove(key)
  }

  getUsers(){
    this.users = this.af.database.list('/users');
  }
  initPolls(){
    this.polls = this.af.database.list('/polls');
  }
  initResults(){
    this.results = this.af.database.list('/results');
  }
  addUserData(clientID, pollOwned){
    this.users.update(this.auth.displayUID(),{
      clientID: clientID,
      qowned: pollOwned
    })
  }
  choosePoll(key){
    this.generateDateTime();
    console.log('KEY: ', key)
    this.af.database.object('/polls/' + key).subscribe(poll => {
      console.log("Current Poll");
      this.currentPoll = poll;
      console.log(this.currentPoll);
      console.log("Current Poll Title: ", this.currentPoll.title);
    })
    this.result = this.fb.group({
    pollID: [this.currentPoll.$key, ],
    title: [this.currentPoll.title, [Validators.required, Validators.minLength(2)]],
    clientID: [this.currentPoll.clientID, Validators.required],
    clientName: [this.currentPoll.clientName, ],
    button: [this.currentPoll.button, Validators.required],
    created: [this.currentTime, ],
    sliders: this.fb.group({
      slider: this.fb.array([
        //initSlider() initalized with showSlider()
        //this.initSlider()
      ])
    }),
    multi: this.fb.group({
      question: [this.currentPoll.multi.question, ],
      choices: this.fb.array([
        // Don't init on ngOnInit, instead should init on +showChoice() button
        // this.initChoice()
      ])
    })

    });
    console.log('Current Result: ', this.result);
    if(this.currentPoll.sliders){
      console.log("Slider detected");
      for (var i=0; i < this.currentPoll.sliders.slider.length; i++){
        console.log('Test', i)
        //console.log(this.currentPoll.sliders.slider[i])
        this.initSlider(-1);
        this.addSlider(i);
      }
  //this.initSlider();
  //this.addSlider();
    }
    if(this.currentPoll.multi.choices){
      for (var i=0; i < this.currentPoll.multi.choices.length; i++){
        this.initChoice(i);
        this.addChoice(i);
      }
    }
  }
  initChoice(i){
    return this.fb.group({
      choice: [this.currentPoll.multi.choices[i], Validators.required],
      chosen: [false, ]
    })
  }
  addChoice(i){
    // See here for why using ['property'] instead of .property:
    // http://stackoverflow.com/questions/41950360/angular2-property-controls-does-not-exist-on-type-abstractcontrol-error-wh
    // TODO: Change to using .get() to improve readability
    const control = this.result.get('multi')['controls']['choices'];
    control.push(this.initChoice(i));
  }
  initSlider(i){
    console.log('Init Slider')
    if (i < 0){
      return this.fb.group({
        slideName: ['', ],
        max: ['', ],
        label1: ['', ],
        label2: ['', ],
        sliderVal: ['', ]
      })
    }else {
      return this.fb.group({
        slideName: [this.currentPoll.sliders.slider[i].slideName, ],
        max: [this.currentPoll.sliders.slider[i].max, ],
        label1: [this.currentPoll.sliders.slider[i].label1, ],
        label2: [this.currentPoll.sliders.slider[i].label2, ],
        sliderVal: ['', ]
      })
    }
  }
  // initSlider(){
  //   console.log('Init Slider')
  //   return this.fb.group({
  //     slideName: ['', ],
  //     sliderVal: ['', ],
  //     label1: ['', ],
  //     label2: ['', ],
  //     max: ['', ]
  //   })
  // }
  addSlider(i){
    console.log('Slider Added')
    console.log('RESULT: ', this.result)
      const control = this.result.controls['sliders']['controls']['slider'];
     console.log('CONTROL: ', control)
    control.push(this.initSlider(i));
  }
  addResult(value){
    //submit form and new /results
    console.log(value);
    this.results.push(value._value);
  }
  viewResult(value){
    console.log(value.value)
  }
  generateDateTime(){
    var newTime = new Date();
    // this.currentTime = newTime
    this.currentTime = firebase.database.ServerValue.TIMESTAMP;
    console.log('Time: ', this.currentTime)
  }
}
