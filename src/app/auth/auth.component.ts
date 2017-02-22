import { Component, OnInit, Inject } from '@angular/core';
import {AngularFireAuth} from 'angularfire2';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(@Inject(AngularFireAuth) public auth: AngularFireAuth) { }

  ngOnInit() {
  }

}
