import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Poll } from './poll-model'
import {Observable, Subject, BehaviorSubject} from "rxjs/Rx";
@Component({
  selector: 'app-makepoll',
  templateUrl: './makepoll.component.html',
  styleUrls: ['./makepoll.component.css'],
})
export class MakepollComponent implements OnInit {
  user: Observable<firebase.User>;
  users: FirebaseListObservable<any[]>;
  polls: FirebaseListObservable<any[]>;
  public slider:boolean = false;
  public yn:boolean = false;
  public multi:boolean = false;
  currentUser;
  public pollForm: FormGroup;
  public ynForm: FormGroup;
  public multiForm: FormGroup;
  public sliderForm: FormGroup;

  constructor(private fb: FormBuilder,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase
  ) { this.users = db.list('/users');
      this.currentUser = afAuth.authState;
      // this.currentUser = user.subscribe({user => return user.uid});
      }

  ngOnInit() {
    // this.getUsers()
    this.pollForm = this.fb.group({
      title: '',
      clientID: this.currentUser.uid,
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
