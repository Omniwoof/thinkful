import { Component, OnInit, Inject } from '@angular/core';
// import { AngularFire, AuthProviders, FirebaseAuthState, AngularFireAuth, AuthMethods, FirebaseListObservable } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  private authState: Observable<firebase.User>;
  inviteID: any;
  private sub: any;
  currentUser;
  // clients: FirebaseListObservable<any[]>;
  // counsellors: FirebaseListObservable<any[]>;
  invite: FirebaseObjectObservable<any[]>;
  auth;
  // id;
  constructor( authService: AuthService,
  private afAuth: AngularFireAuth,
  public db: AngularFireDatabase,
  public route: ActivatedRoute,
) {
    this.auth = afAuth.authState;
    this.auth.subscribe(user => {this.currentUser = user})

}
  ngOnInit() {
    console.log('CurrentUser: ',this.currentUser)
    this.inviteID = this.route.snapshot.params.id
    console.log(this.inviteID)
    this.invite = this.db.object('/clients/'+this.inviteID)
    console.log('isub ',this.invite)

  //   this.clients = this.auth.switchMap(user => {
  //     return this.db.list('/clients',{
  //       query: {
  //         orderByChild: 'counsellor',
  //         equalTo: user.uid
  //       }
  //     });
  //   })
  //
  //   this.counsellors = this.auth.switchMap(user => {
  //   return this.db.list('/clients',{
  //     query: {
  //       orderByChild: 'client',
  //       equalTo: user.uid
  //     }
  //   });
  // })
  }
  acceptInvitation(){
    console.log('CurrentUser: ',this.currentUser)
    console.log('Invite Accepted')
    this.invite.update({
      clientID: this.currentUser.uid
    })

  }
}
