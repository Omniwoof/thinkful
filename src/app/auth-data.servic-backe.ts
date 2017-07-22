import { Injectable } from '@angular/core';
// import { AuthProviders } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
// import firebase probably not needed
import * as firebase from 'firebase';

// Creates a list of variables for user data
// Each variable needs to be defined here because authData.uid works but
// for some reason authData.auth.uid isn't working - weird
// Generate all user data that you want to use here and just inject it into the
// app with 'authData.VAR' for the template and 'this.authData.VAR' elsewhere

//TODO make sure subscribe updates the userdata

@Injectable()

export class AuthDataService {
  userdata:Object
  displayName:string
  uid:string
  photoURL:string

  constructor(public afAuth: AngularFireAuth) {
    // afAuth.subscribe(auth => {
    //   console.log(auth),
    //   this.uid = auth.uid,
    //   this.userdata = auth,
    //   this.displayName = auth.auth.displayName,
    //   this.photoURL = auth.auth.photoURL
    // });
    console.log("TEST USERDATA: ")
    console.log(this.userdata)
  }
  ngOnInit() {
    console.log('Data Service Loaded')
  }
  login() {
    this.afAuth.auth.signOut().then(() => {
      console.log('LOGGED OUT')
 });
 }

 logout() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
 }
}
