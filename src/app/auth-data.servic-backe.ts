import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders } from 'angularfire2';
// import firebase probably not needed
//import * as firebase from 'firebase';

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

  constructor(public af: AngularFire) {
    this.af.auth.subscribe(auth => {
      console.log(auth),
      this.uid = auth.uid,
      this.userdata = auth,
      this.displayName = auth.auth.displayName,
      this.photoURL = auth.auth.photoURL
    });
    console.log("TEST USERDATA: ")
    console.log(this.userdata)
  }
  login() {
   this.af.auth.login();
 }

 logout() {
    this.af.auth.logout();
 }
}
