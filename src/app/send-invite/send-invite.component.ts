import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-send-invite',
  templateUrl: './send-invite.component.html',
  styleUrls: ['./send-invite.component.css']
})
export class SendInviteComponent implements OnInit {
  invite: FormGroup
  clients: FirebaseListObservable<any[]>;
  auth;
  user;

  constructor(public fb: FormBuilder,
              public afAuth: AngularFireAuth,
              public db: AngularFireDatabase
  ) {
    this.auth = afAuth.auth;
    this.user = this.auth.currentUser
    this.clients = db.list('/clients')
   }

  ngOnInit() {
    this.invite = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      clientNickName:['', [Validators.required]],
      clientRef: ['']
    })
    console.log(this.invite.status)
    console.log("currentUser: ", this.user.displayName)
  }

  onSubmit(submission) {
    if (submission.status == 'VALID'){
      console.log('Valid Submission! ', submission.value.email)
      this.clients.push({
        clientEmail: submission.value.email,
        clientNickName: submission.value.clientNickName,
        clientRef: submission.value.clientRef,
        counsellor: this.user.displayName,
        counsellorID: this.user.uid
      })
      //OK! Now push email, username, counsellor uid and userame to /clients
    }else{
      console.log('Invalid Submission!')
    }
  }

  clearInvite(){
    this.invite.reset();
  }

}
