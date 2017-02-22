import { Injectable, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, FirebaseAuthState, AngularFireAuth, AuthMethods, FirebaseListObservable } from 'angularfire2';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { Subject } from 'rxjs/Subject';

// import firebase probably not needed
//import * as firebase from 'firebase';

// Creates a list of variables for user data
// Each variable needs to be defined here because authData.uid works but
// for some reason authData.auth.uid isn't working - weird
// Generate all user data that you want to use here and just inject it into the
// app with 'authData.VAR' for the template and 'this.authData.VAR' elsewhere

//TODO make sure subscribe updates the userdata

@Injectable()

export class AuthService {
  private authState: FirebaseAuthState;
  clients:  FirebaseListObservable<any[]>;
  currentPath;
  inviteID;
  UID;
  constructor(
    public auth$: AngularFireAuth,
    private af: AngularFire,
    private router : Router,
  ) {
    //this.authState = auth$.getAuth();
    auth$.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
    });
    // Observable of current URL
    this.router.events.map(p=>p.url).subscribe(path => {
      // outputs stream of URLS from the Observable
      console.log('path = ', path);
      //extracts inviteID from the URL if it exists
      this.currentPath = path.split('/');
      if (this.currentPath.includes('invite') == true){
        this.inviteID = this.currentPath[2];
      } else {
        this.inviteID = ''
      }
    });
  }
  ngOnInit() {
    this.initClients();
  }
  get authenticated(): boolean {
    return this.authState != null;
  }
  signInWithFacebook(): firebase.Promise<FirebaseAuthState> {
    return this.auth$.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup
    });

  }
  displayName():string {
      if (this.authState != null) {
        return this.authState.auth.displayName;
      } else {
        return 'Please Sign In';
      }
  }
  displayUID():string {
      if (this.authState !=null) {
        this.UID = this.authState.uid
        return this.authState.uid
      } else {
        return 'UserID: None'
      }
  }
  displayPhoto():string {
    if (this.authState != null) {
      return this.authState.auth.photoURL
    }else {
      return 'http://impactspace.com/images/uploads/person-default.png'
    }
  }
  signInWithGoogle() {
   this.auth$.login({
     provider: AuthProviders.Google,
     method: AuthMethods.Redirect
   })
   this.addClient()
 }

 logout():void {
    this.af.auth.logout().then(() => {
      console.log('LOGGED OUT')
    });
 }
 initClients(){
   console.log('Clients Init');

 }
 addClient(){
   // TODO - Validation required. Check valid UID and no duplicates.
   // WARNING - Any string after /invite/ in the url will automatically be
   // used to create a client/counsellor relationship
   this.clients = this.af.database.list('/clients');
   this.clients.push({
     client: this.displayUID(),
     counsellor: this.inviteID
   });
 }
}
