import { Component, OnInit, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, AngularFireAuth } from 'angularfire2';
import { AuthService } from '../auth.service';
import {Observable, Subject, BehaviorSubject} from "rxjs/Rx";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { ChartReadyEvent } from 'ng2-google-charts';
declare var google:any;
declare var wrapper:any;
var aggregate:string;



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
  data:any;
  emptyData: any;
  // rawData =  [
  //       [new Date(1491393179918), 25],
  //       [new Date(1491393180635), 26],
  //       [new Date(1491393181179), 27],
  //       [new Date(1491393181776), 27],
  //       [new Date(1491393183743), 29],
  //       [new Date(1491396342582), 29],
  //       [new Date(1491396351467), 35],
  //       [new Date(1491396526698), 36],
  //       [new Date(1491800079971), 34],
  //       [new Date(1491800085958), 32],
  //       [new Date(1494306732122), 31]
  //     ]
  public lineChartOptions:any =  {
    chartType: 'AnnotationChart',

    dataTable: [],
    options: {
      // title: 'Client Feedback',
      width: 800,
      displayAnnotations: true,
      pointsVisible: true,
      pointSize: 20,
      zoomEndTime: new Date(1494994428768),
      // zoomStartTime: None,
      // curveType: 'function',
      // colors: ['#a52714'],
      // hAxis: {
      //    title: 'Time',
      //    format:'MMM d, y',
      //    textStyle: {
      //       color: '#01579b',
      //       fontSize: 20,
      //       fontName: 'Arial',
      //       bold: true,
      //       italic: true
      //    },
      //    titleTextStyle: {
      //       color: '#01579b',
      //       fontSize: 16,
      //       fontName: 'Arial',
      //       bold: false,
      //       italic: true
      //    }
      // },
      // vAxis: {
      //    title: 'Counts',
      //    textStyle: {
      //       color: '#1a237e',
      //       fontSize: 24,
      //       bold: true
      //    },
      //    titleTextStyle: {
      //       color: '#1a237e',
      //       fontSize: 24,
      //       bold: true
      //    }
      // }
    }
  };


  constructor(private fb: FormBuilder,
    public af: AngularFire,
    @Inject('authData') auth) { this.auth = auth; }

    public ready(event: ChartReadyEvent) {
    }
  ngOnInit() {
    //subscribe to userdata from auth.service
    this.auth.auth$.subscribe(authState => {
      console.log('AuthState: '+ authState);
      console.log(authState);
    })
    this.getUsers()
    this.initPolls()
    this.initResults()
    console.log("Chart Options: ", this.lineChartOptions)
    // this.initChart()

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
    aggregate = 'daily';
    //this.initChart()
    // Generates Server Based Date/Time Stamp
    this.generateDateTime();
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
    // this.lineChartOptions.options.title = this.result.value.title
    console.log('CHART TITLE: ', this.lineChartOptions.options.title)
    this.currentResults.subscribe(data => {
      this.data=[]
      console.log('DATA SUB: ', data)
      //If slider or multi, map data differently
      //TODO: Add test if there is no data
      if (data[0].sliders != null && data[0].multi.choices != null){
        data.forEach(value => {
          var newData= []
          newData.push(new Date(value.created))
          value.sliders.slider.forEach(slider => {
            newData.push(slider.sliderVal)
          })
          value.multi.choices.forEach(multi => {
            //Places true/false values on the same scale as the slider
            newData.push(Number(multi.chosen*data[0].sliders.slider[0].max))
          })
          this.data.push(newData)
        })
        this.combinedData()
      }
      else if (data[0].sliders){
        data.forEach(value => {
          var newData = []
          newData.push(new Date(value.created))
          value.sliders.slider.forEach(slider => {
            newData.push(slider.sliderVal)
          })
          this.data.push(newData)
        })
        this.sliderData()
        // this.data = data.map(value => [new Date(value.created),
        //   value.sliders.slider[0].sliderVal])
        //       console.log('DATA MAP: ', this.data)
        //       this.sliderData()
        // console.log('GENSLIDER')
      }
      else if (data[0].multi.question){
        //GenMulti Data
        data.forEach(value => {
          var newData = []
          newData.push(new Date(value.created))
          value.multi.choices.forEach(choice => {
            newData.push(Number(choice.chosen))
          })
          this.data.push(newData)
        })
        this.multiData()

        // this.data = data.map((value, index) => [new Date(value.created),
        //   Number(value.multi.choices[0].chosen),
        //   Number(value.multi.choices[1].chosen),
        //   Number(value.multi.choices[2].chosen)])
        //       console.log('DATA MAP: ', this.data)
        //       this.multiData()
        // console.log('GENMULTI')
      }else {this.data = data.map(value => [new Date(value.created), 1])
            console.log('DATA MAP: ', this.data)
            this.genData()
          }

          // initRangeChangeDetection()
    })
    console.log('DATATABLE: ', this.data)
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
  floorDate(datetime) {
    console.log('Aggregate =', aggregate)
    console.log('FloorDate datetime: ', datetime)
    var newDate = new Date(datetime);
    if (aggregate = 'daily'){
    newDate.setHours(0);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0)
  }
    return newDate;
  }
  genData(){
      let dataTable = new google.visualization.DataTable();
            dataTable.addColumn('date', 'Time');
            dataTable.addColumn('number', 'Count');
            console.log('DATA ARRAY', this.data)
            dataTable.addRows(this.data);
              // function floorDate(datetime) {
              //   var newDate = new Date(datetime);
              //   newDate.setHours(0);
              //   newDate.setMinutes(0);
              //   newDate.setSeconds(0);
              //   newDate.setMilliseconds(0)
              //   return newDate;
              // }
              var newData = google.visualization.data.group(dataTable, [{
                column: 0,
                modifier: this.floorDate,
                //aggregation: google.visualization.data.sum,
                type: 'date'
            }], [{
                column: 1,
                label: 'Counts',
                aggregation: google.visualization.data.sum,
                type: 'number'
            }]);
            console.log('DataTable: ', dataTable)
            console.log('NewDataTable: ', newData)
            //Re-initalizes the chart
    this.lineChartOptions = Object.create(this.lineChartOptions);
    this.lineChartOptions.dataTable = newData
  }
  sliderData(){
    let dataTable = new google.visualization.DataTable();
          var yData = []
          dataTable.addColumn('date', 'Time');
          this.result.value.sliders.slider.forEach((element, index) => {
            dataTable.addColumn('number', element.slideName)
            yData.push({
              column: index+1,
              label: element.slideName,
              aggregation: google.visualization.data.sum,
              type: 'number'
            })
          })

          // dataTable.addColumn('number', 'Value');
          dataTable.addRows(this.data);
          this.lineChartOptions = Object.create(this.lineChartOptions);
          this.lineChartOptions.dataTable = dataTable
  }
  multiData(){
    let dataTable = new google.visualization.DataTable();
    var yData = []
          dataTable.addColumn('date', 'Time');
          this.result.value.multi.choices.forEach((element, index) => {
            console.log('ForEach Choice #'+index+":", element.choice.choice)
            dataTable.addColumn('number', element.choice.choice)
            yData.push({column: index+1,
              label: element.choice.choice,
              aggregation: google.visualization.data.sum,
              type: 'number'})
          })
          // console.log('Col1: ',this.result.value.multi.choices[0].choice.choice)
          // console.log('Col2: ',this.result.value.multi.choices[1].choice.choice)
          // dataTable.addColumn('number', this.result.value.multi.choices[0].choice.choice);
          // dataTable.addColumn('number', this.result.value.multi.choices[1].choice.choice);
          // console.log('CurrentData: ',this.data)
          dataTable.addRows(this.data);
          // console.log('CurrentDataTable: ', dataTable)
          // function floorDate(datetime) {
          //   var newDate = new Date(datetime);
          //   newDate.setHours(0);
          //   newDate.setMinutes(0);
          //   newDate.setSeconds(0);
          //   newDate.setMilliseconds(0)
          //   return newDate;
          // }


          // var yData = this.result.value.multi.choices.map((element, index) => {
          //   return {column: index+1,
          //     label: element.choice.choice,
          //     aggregation: google.visualization.data.sum,
          //     type: 'number'}
          // })
          // var yData = [{
          //     column: 1,
          //     label: this.result.value.multi.choices[0].choice.choice,
          //     aggregation: google.visualization.data.sum,
          //     type: 'number'
          // },
          // {
          //     column: 2,
          //     label: this.result.value.multi.choices[1].choice.choice,
          //     aggregation: google.visualization.data.sum,
          //     type: 'number'
          // }]
          console.log('yData: ', yData)
          var newData = google.visualization.data.group(dataTable, [{
            column: 0,
            modifier: this.floorDate,
            type: 'date'
        }], yData
      );
          console.log('NEWDATA: ', newData )
          this.lineChartOptions = Object.create(this.lineChartOptions);
          this.lineChartOptions.dataTable = newData
  }
  combinedData(){
    console.log('combinedData: ', this.data)
    let dataTable = new google.visualization.DataTable();
    console.log('this.result.value.sliders.slider.length: ',this.result.value.sliders.slider.length)
    var yData = []
          dataTable.addColumn('date', 'Time');
          this.result.value.sliders.slider.forEach((element, index) => {
            console.log('ForEach Slider #'+index+":", element.slideName)
            dataTable.addColumn('number', element.slideName)
            yData.push({
              column: index+1,
              label: element.slideName,
              aggregation: google.visualization.data.sum,
              type: 'number'
            })
          })
          this.result.value.multi.choices.forEach((element, index) => {
            console.log('ForEach Choice #'+index+this.result.value.sliders.slider.length+":", element.choice.choice)
            dataTable.addColumn('number', element.choice.choice)
            yData.push({column: index+1+this.result.value.sliders.slider.length,
              label: element.choice.choice,
              aggregation: google.visualization.data.sum,
              type: 'number'})
          })
          console.log('yData: ', yData)
          dataTable.addRows(this.data);
          // function floorDate(datetime) {
          //   var newDate = new Date(datetime);
          //   newDate.setHours(0);
          //   newDate.setMinutes(0);
          //   newDate.setSeconds(0);
          //   newDate.setMilliseconds(0)
          //   return newDate;
          // }
          var newData = google.visualization.data.group(dataTable, [{
            column: 0,
            modifier: this.floorDate,
            type: 'date'
        }], yData
      );
          console.log('NEWDATA: ', newData )
          this.lineChartOptions = Object.create(this.lineChartOptions);
          this.lineChartOptions.dataTable = newData
          google.visualization.events.addListener(wrapper, 'rangechange', this.rangechange_handler);
  }
  // initRangeChangeDetection(){
  //   google.visualization.events.addListener(this.lineChartOptions, 'rangechange', this.rangechange_handler);
  // }
  rangechange_handler(e){
    console.log('Range changed to ', e['start'], ' and ', e['end']);
  }
}
