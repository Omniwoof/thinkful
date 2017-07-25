import { Injectable, OnInit } from '@angular/core';
// import { AngularFire, AuthProviders, FirebaseAuthState, AuthMethods, FirebaseListObservable } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {ActivatedRoute, Router} from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';


// Creates a list of variables for user data
// Each variable needs to be defined here because authData.uid works but
// for some reason authData.auth.uid isn't working - weird
// Generate all user data that you want to use here and just inject it into the
// app with 'authData.VAR' for the template and 'this.authData.VAR' elsewhere

//TODO make sure subscribe updates the userdata

@Injectable()

export class AuthService {
  private authState: Observable<firebase.User>;
  clients:  FirebaseListObservable<any[]>;
  currentPath;
  currentUser;
  inviteID;
  userSub;
  UID;
  user: Observable<firebase.User>;
  constructor(
    public afAuth: AngularFireAuth,
    private router : Router,
    db: AngularFireDatabase,
  ) {
    this.user = afAuth.authState;
    //this.authState = auth$.getAuth();
    // afAuth.subscribe((state: FirebaseAuthState) => {
    //   this.authState = state;
    // });
    // this.user = afAuth;
    // // Observable of current URL
    // this.router.events.map(p=>p.url).subscribe(path => {
    //   // outputs stream of URLS from the Observable
    //   console.log('path = ', path);
    //   //extracts inviteID from the URL if it exists
    //   this.currentPath = path.split('/');
    //   if (this.currentPath.includes('invite') == true){
    //     this.inviteID = this.currentPath[2];
    //   } else {
    //     this.inviteID = ''
    //   }
    // });
  }
  ngOnInit() {
    console.log("Auth Service INIT")
    // this.initClients();
  }
  // get authenticated(): boolean {
  //   return this.authState != null;
  // }
  // signInWithFacebook(): firebase.Promise<FirebaseAuthState> {
  //   return this.afAuth.login({
  //     provider: AuthProviders.Facebook,
  //     method: AuthMethods.Popup
  //   });
  //
  // }
 //  displayName():string {
 //      if (this.user != null) {
 //        return this.user;
 //      } else {
 //        return 'Please Sign In';
 //      }
 //  }
 //  displayUID():string {
 //      if (this.user !=null) {
 //        this.UID = this.authState.uid
 //        return this.authState.uid
 //      } else {
 //        return 'UserID: None'
 //      }
 //  }
 //  displayPhoto():string {
 //    if (this.authState != null) {
 //      return this.authState.auth.photoURL
 //    }else {
 //      return 'http://impactspace.com/images/uploads/person-default.png'
 //    }
 //  }
 //  signInWithGoogle() {
 //   this.afAuth.login({
 //     provider: AuthProviders.Google,
 //     method: AuthMethods.Redirect
 //   })
 //   this.addClient()
 // }
 //
 logout() {
   this.userSub.unsubscribe();
   this.afAuth.auth.signOut();
 }
 login(){
   this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
 }
 getUser(){
   this.userSub = this.user.subscribe(
     user => {this.currentUser = user
     console.log(this.currentUser)
     if (this.currentUser){console.log('CurrentUSerService: ', this.currentUser.uid)}
   },
     err => console.log(err)
   )
 }
 // initClients(){
 //   console.log('Clients Init');
 //
 // }
 // addClient(){
 //   // TODO - Validation required. Check valid UID and no duplicates.
 //   // WARNING - Any string after /invite/ in the url will automatically be
 //   // used to create a client/counsellor relationship
 //   this.clients = db.list('/clients');
 //   this.clients.push({
 //     client: this.displayUID(),
 //     counsellor: this.inviteID
 //   });
 // }
}
