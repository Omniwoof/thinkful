import { Component, OnInit, Inject } from '@angular/core';
// import { AngularFire, AuthProviders, FirebaseAuthState, AngularFireAuth, AuthMethods, FirebaseListObservable } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  private authState: Observable<firebase.User>;
  id: number;
  private sub: any;
  clients: FirebaseListObservable<any[]>;
  counsellors: FirebaseListObservable<any[]>;
  auth;

  constructor( @Inject('authData') auth,
  private afAuth: AngularFireAuth,
  public db: AngularFireDatabase
) {
    this.auth = auth;
    this.clients = db.list('/clients',{
      query: {
        orderByChild: 'counsellor',
        equalTo: this.auth.displayUID()
      }
    });
    this.counsellors = db.list('/clients',{
      query: {
        orderByChild: 'client',
        equalTo: this.auth.displayUID()
      }
    });
  }

  ngOnInit() {
    // this.getClients();
    // this.getCounsellors();
  }
  // getClients(){
  //   this.clients = db.list('/clients',{
  //     query: {
  //       orderByChild: 'counsellor',
  //       equalTo: this.auth.displayUID()
  //     }
  //   });
  // }
  // getCounsellors(){
  //   console.log('DUSPLAY ID: ', this.auth.UID)
  //   this.counsellors = db.list('/clients',{
  //     query: {
  //       orderByChild: 'client',
  //       equalTo: this.auth.displayUID()
  //     }
  //   });
  // }

}
