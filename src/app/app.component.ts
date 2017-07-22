import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
// import { FirebaseListObservable } from 'angularfire2';
// import { Subject } from 'rxjs/Subject';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  providers: [AuthService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Inside Outcomes';
  user: Observable<firebase.User>;
  userSub;
  currentUser;
  constructor(
    public afAuth: AngularFireAuth,
    public authService: AuthService
  ){
    this.user = afAuth.authState;
    this.currentUser = authService.getUser();
  }

// getUser(){
//   this.userSub = this.user.subscribe(
//     user => {this.currentUser = user
//     console.log(this.currentUser)
//     console.log(this.currentUser.uid)
//   },
//     err => console.log(err)
//   )
// }
//
// login() {
//   this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
// }
//
// logout() {
//   this.userSub.unsubscribe();
//   this.afAuth.auth.signOut();
// }
}
