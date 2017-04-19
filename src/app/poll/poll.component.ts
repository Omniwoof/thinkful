import { Component, OnInit, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, AngularFireAuth } from 'angularfire2';
import { AuthService } from '../auth.service';
import {Observable, Subject, BehaviorSubject} from "rxjs/Rx";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
declare var google:any;

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {
  users: FirebaseListObservable<any[]>;
  polls: FirebaseListObservable<any[]>;
  results: FirebaseListObservable<any[]>;
  currentPoll;
  currentResults;
  result: FormGroup;
  auth;
  currentTime;
  lineChartOptions;
  lineControlOptions;
  data2 = [ [ "2017-04-05T11:52:59.918Z", 1 ], [ "2017-04-05T11:53:00.635Z", 1 ], [ "2017-04-05T11:53:01.179Z", 1 ], [ "2017-04-05T11:53:01.776Z", 1 ], [ "2017-04-05T11:53:03.743Z", 1 ], [ "2017-04-05T12:45:42.582Z", 1 ], [ "2017-04-05T12:45:48.164Z", 1 ], [ "2017-04-05T12:45:51.467Z", 1 ], [ "2017-04-05T12:48:41.928Z", 1 ], [ "2017-04-05T12:48:46.698Z", 1 ], [ "2017-04-10T04:58:56.290Z", 1 ], [ "2017-04-11T06:21:39.479Z", 1 ] ]
  dataTable;
  currentChart;

  constructor(private fb: FormBuilder,
    public af: AngularFire,
    @Inject('authData') auth) { this.auth = auth; }

  ngOnInit() {
    //subscribe to userdata from auth.service
    this.auth.auth$.subscribe(authState => {
      console.log('AuthState: '+ authState);
      console.log(authState);
    })
    this.getUsers()
    this.initPolls()
    this.initResults()
    // this.drawChart()
    // this.altChart()
  }
  delete(key) {
    this.polls.remove(key)
  }
  deleteResult(key){
    this.results.remove(key)
  }

  getUsers(){
    this.users = this.af.database.list('/users');
  }
  initPolls(){
    this.polls = this.af.database.list('/polls');
  }
  initResults(){
    this.results = this.af.database.list('/results');
  }
  addUserData(clientID, pollOwned){
    this.users.update(this.auth.displayUID(),{
      clientID: clientID,
      qowned: pollOwned
    })
  }
  choosePoll(key){
    this.altChart()
    //this.generateDateTime();
    console.log('KEY: ', key)
    this.af.database.object('/polls/' + key).subscribe(poll => {
      this.currentPoll = poll;
      console.log('CURRENT POLL: ', this.currentPoll);
      console.log('CURRENT POLL KEY: ', this.currentPoll.$key);
    })
    this.currentResults = this.af.database.list('/results/', {
      query: {
        orderByChild: 'pollID',
        equalTo: this.currentPoll.$key
      }
    })
    console.log('CURRENT RESULTS: ', this.currentResults)
      // console.log('Created: ', data[0].created)
      // this.dataTable.push([new Date(data.created), 1])
    this.currentResults.subscribe(data2 => {
      console.log('DATA SUB: ', data2)
      this.data2 = data2.map(value => [new Date(value.created), 1])
      console.log('DATA MAP: ', this.data2)
      //this.data.unshift([Date, 'Count'])
      // this.initChart()
      this.altChart()
      //this.drawChart()
    })
    console.log('DATATABLE: ', this.data2)
    // if (this.data) {
    //   this.data.unshift([Date, 'Count'])
    //   console.log('YES DATA')
    //   console.log('DATATABLE: ', this.data)
    //   this.initChart()
    // }
    // else{
    //   console.log('NO DATA')
    //   console.log('DATATABLE: ', this.data)
    // }
    this.result = this.fb.group({
    pollID: [this.currentPoll.$key, ],
    title: [this.currentPoll.title, [Validators.required, Validators.minLength(2)]],
    clientID: [this.currentPoll.clientID, Validators.required],
    clientName: [this.currentPoll.clientName, ],
    button: [this.currentPoll.button, Validators.required],
    created: [this.currentTime, ],
    sliders: this.fb.group({
      slider: this.fb.array([
        //initSlider() initalized with showSlider()
        //this.initSlider()
      ])
    }),
    multi: this.fb.group({
      question: [this.currentPoll.multi.question, ],
      choices: this.fb.array([
        // Don't init on ngOnInit, instead should init on +showChoice() button
        // this.initChoice()
      ])
    })

    });
    console.log('Current Result: ', this.result);
    if(this.currentPoll.sliders){
      console.log("Slider detected");
      for (var i=0; i < this.currentPoll.sliders.slider.length; i++){
        console.log('Test', i)
        //console.log(this.currentPoll.sliders.slider[i])
        this.initSlider(-1);
        this.addSlider(i);
      }
  //this.initSlider();
  //this.addSlider();
    }
    if(this.currentPoll.multi.choices){
      for (var i=0; i < this.currentPoll.multi.choices.length; i++){
        this.initChoice(i);
        this.addChoice(i);
      }
    }
  }
  initChoice(i){
    return this.fb.group({
      choice: [this.currentPoll.multi.choices[i], Validators.required],
      chosen: [false, ]
    })
  }
  addChoice(i){
    // See here for why using ['property'] instead of .property:
    // http://stackoverflow.com/questions/41950360/angular2-property-controls-does-not-exist-on-type-abstractcontrol-error-wh
    // TODO: Change to using .get() to improve readability
    const control = this.result.get('multi')['controls']['choices'];
    control.push(this.initChoice(i));
  }
  initSlider(i){
    console.log('Init Slider')
    if (i < 0){
      return this.fb.group({
        slideName: ['', ],
        max: ['', ],
        label1: ['', ],
        label2: ['', ],
        sliderVal: ['', ]
      })
    }else {
      return this.fb.group({
        slideName: [this.currentPoll.sliders.slider[i].slideName, ],
        max: [this.currentPoll.sliders.slider[i].max, ],
        label1: [this.currentPoll.sliders.slider[i].label1, ],
        label2: [this.currentPoll.sliders.slider[i].label2, ],
        sliderVal: ['', ]
      })
    }
  }
  // initSlider(){
  //   console.log('Init Slider')
  //   return this.fb.group({
  //     slideName: ['', ],
  //     sliderVal: ['', ],
  //     label1: ['', ],
  //     label2: ['', ],
  //     max: ['', ]
  //   })
  // }
  addSlider(i){
    console.log('Slider Added')
    console.log('RESULT: ', this.result)
      const control = this.result.controls['sliders']['controls']['slider'];
     console.log('CONTROL: ', control)
    control.push(this.initSlider(i));
  }
  addResult(value){
    //submit form and new /results
    console.log(value);
    this.results.push(value._value);
  }
  viewResult(value){
    console.log(value.value)
  }
  generateDateTime(){
    var newTime = new Date();
    // this.currentTime = newTime
    this.currentTime = firebase.database.ServerValue.TIMESTAMP;
    console.log('Time: ', this.currentTime)
  }
  drawChart() {
    let data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Counts');
        data.addRows([ [ "2017-04-05T11:52:59.918Z", 1 ], [ "2017-04-05T11:53:00.635Z", 1 ], [ "2017-04-05T11:53:01.179Z", 1 ], [ "2017-04-05T11:53:01.776Z", 1 ], [ "2017-04-05T11:53:03.743Z", 1 ], [ "2017-04-05T12:45:42.582Z", 1 ], [ "2017-04-05T12:45:48.164Z", 1 ], [ "2017-04-05T12:45:51.467Z", 1 ], [ "2017-04-05T12:48:41.928Z", 1 ], [ "2017-04-05T12:48:46.698Z", 1 ], [ "2017-04-10T04:58:56.290Z", 1 ], [ "2017-04-11T06:21:39.479Z", 1 ] ]);
        // data.addRows(this.data2)
    let options = {'title':'How Much Pizza I Ate Last Night',
                       'width':500,
                       'height':300};
   let chart = new google.visualization.LineChart(document.getElementById('chart_div'));
       chart.draw(data, options);
  }
  altChart(){
    this.genData()
    // google.charts.load('current', {'packages':['corechart']});
    // google.charts.setOnLoadCallback(drawChart);
    google.charts.load('current',
     { packages: ['corechart'], callback: this.drawChart });
    // function drawChart() {
    //   let newData = this.data
    //   console.log('NewData: ', newData)
    //   var data = new google.visualization.DataTable();
    //       data.addColumn('string', 'Topping');
    //       data.addColumn('number', 'Slices');
    //       data.addRows([
    //         ['Mushrooms', 3],
    //         ['Onions', 1],
    //         ['Olives', 1],
    //         ['Zucchini', 1],
    //         ['Pepperoni', 2]
    //       ]);
    //   var options = {'title':'How Much Pizza I Ate Last Night',
    //                      'width':500,
    //                      'height':300};
    //  var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    //      chart.draw(data, options);
    // }
  }
  genData(){
    console.log('GenData: ', this.data2)
    return this.data2
  }
  // initChart(){
  // this.lineChartOptions =  {
  //   chartType: 'LineChart',
  //   dataTable: this.data,
  //   options: {'title': 'Counter',
  //   vAxis: {
  //           title: 'Number of Counts'
  //         }
  //     },
  //   };
  // }
}
