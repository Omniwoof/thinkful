import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFire, FirebaseListObservable, AngularFireAuth } from 'angularfire2';
import { PollModel } from './poll-model'
@Component({
  selector: 'app-makepoll',
  templateUrl: './makepoll.component.html',
  styleUrls: ['./makepoll.component.css'],
})
export class MakepollComponent implements OnInit {
  users: FirebaseListObservable<any[]>;
  slider;
  yn;
  multi;
  currentUser;
  pollForm: FormGroup;
  sliderForm: FormGroup;
  ynForm: FormGroup;
  multiForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public af: AngularFire) { }

  ngOnInit() {
    this.getUsers()
    this.pollForm = this.formBuilder.group({
      title: '',
      clientID: this.currentUser,
      buttonLabel: ''
    });
    this.sliderForm = this.formBuilder.group({
      type: 'Slider',
      maxSlider: '',
      label1: '',
      label2: '',
    });
    this.ynForm = this.formBuilder.group({
      type: 'YN',
    });
    this.multiForm = this.formBuilder.group({
      type: 'Multi',
      choices: this.formBuilder.array([
        this.initChoice()
      ])
    })
  }
  addSlider(){
    this.slider= true;
    this.yn=false;
    this.multi=false;
  }
  addYN(){
    this.slider= false;
    this.yn=true;
    this.multi=false;
  }
  addMulti(){
    this.slider= false;
    this.yn=false;
    this.multi=true;
  }
  getUsers(){
    this.users = this.af.database.list('/users');
  }
  selectedUser(userKey){
    this.currentUser = userKey
  }
  addChoice(){
    console.log('CHOICE ADDED')
    const control = <FormArray>this.multiForm.controls['choices'];
    control.push(this.initChoice());
  }
  initChoice(){
    return this.formBuilder.group({
      choice: ''
    })
  }
  removeChoice(i: number){
    const control = <FormArray>this.multiForm.controls['choices'];
    control.removeAt(i);
  }
}
