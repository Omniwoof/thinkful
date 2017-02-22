import { Component, OnInit, Inject } from '@angular/core';
import { AngularFire, AuthProviders, FirebaseAuthState, AngularFireAuth, AuthMethods, FirebaseListObservable } from 'angularfire2';


@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  private authState: FirebaseAuthState;
  id: number;
  private sub: any;
  clients: FirebaseListObservable<any[]>;
  counsellors: FirebaseListObservable<any[]>;
  auth;

  constructor( @Inject('authData') auth, private af: AngularFire) {
    this.auth = auth;
  }

  ngOnInit() {
    this.getClients();
    this.getCounsellors();
  }
  getClients(){
    this.clients = this.af.database.list('/clients',{
      query: {
        orderByChild: 'counsellor',
        equalTo: this.auth.displayUID()
      }
    });
  }
  getCounsellors(){
    console.log('DUSPLAY ID: ', this.auth.UID)
    this.counsellors = this.af.database.list('/clients',{
      query: {
        orderByChild: 'client',
        equalTo: this.auth.displayUID()
      }
    });
  }

}
