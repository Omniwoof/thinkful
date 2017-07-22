import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Poll } from './poll-model'
@Component({
  selector: 'app-makepoll',
  templateUrl: './makepoll.component.html',
  styleUrls: ['./makepoll.component.css'],
})
export class MakepollComponent implements OnInit {
  users: FirebaseListObservable<any[]>;
  polls: FirebaseListObservable<any[]>;
  slider;
  yn;
  multi;
  currentUser;
  pollForm: FormGroup;
  ynForm: FormGroup;
  multiForm: FormGroup;
  sliderForm: FormGroup;

  constructor(private fb: FormBuilder,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase
  ) { this.users = db.list('/users');}

  ngOnInit() {
    // this.getUsers()
    this.pollForm = this.fb.group({
      title: '',
      clientID: this.currentUser,
      buttonLabel: '',
      sliderForm: this.fb.group({
        maxSlider: '',
        label1:'',
        label2:''
      })
    });
    this.sliderForm = this.fb.group({
      type: 'Slider',
      maxSlider: '',
      label1: '',
      label2: ''
    });
    this.ynForm = this.fb.group({
      type: 'YN',
    });
    this.multiForm = this.fb.group({
      type: 'Multi',
      choices: this.fb.array([
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
  // getUsers(){
  //   return this.users
  // }
  selectedUser(userKey){
    this.currentUser = userKey
  }
  addChoice(){
    console.log(this.multiForm.value.choices[0].choice)
    const control = <FormArray>this.multiForm.controls['choices'];
    control.push(this.initChoice());
  }
  initChoice(){
    return this.fb.group({
      choice: ''
    })
  }
  removeChoice(i: number){
    const control = <FormArray>this.multiForm.controls['choices'];
    control.removeAt(i);
  }
  onSubmit( model: Poll ){
    console.log(model)
  }
  initSlider(){
    return this.fb.group({
      maxSlider: '',
      label1: '',
      label2: ''
    })
  }
  removeSlider(i: number){
    const control = <FormArray>this.pollForm.controls['sliders'];
    control.removeAt(i);
  }
}
