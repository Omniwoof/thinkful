import { Component, OnInit } from '@angular/core';
import {Directive, ElementRef, Input} from "@angular/core";

@Directive({
  selector: '[appChart]'
})
export class ChartDirective {
  el: HTMLElement;
  w: any;
  private _content: any[] = [];

  @Input()
  set content(c: any[]) {
  console.log("Setting content ...");
  this._content = c;
  this.draw();
  }

  get content() { return this._content; }

  constructor(elementRef: ElementRef)  {
    //elementRef.nativeElement.style.backgroundColor = 'yellow';
    console.log("Constructing chart directive");
    this.w = window;
    this.el = elementRef.nativeElement; // You cannot use elementRef directly !
    console.log("Native HTML :", this.el);
    if (!this.w.google) { console.error("Hey ! It seems the needed google script was not loaded ?"); };
    }

  // Do the actual drawing
  draw() {
    // Create the data table.
    let data = new this.w.google.visualization.DataTable();
    data.addColumn("date", "Quand");
    data.addColumn("number", "KG");
    let rows = [
      [Date, 'Count'],
      [new Date(1491393179918), 11],
      [new Date(1491393180635), 2],
      [new Date(1491393181179), 2],
      [new Date(1491393181776), 2],
      [new Date(1491393183743), 7]
    ];
    data.addRows(rows);
    // Create options
    let options: any = {
      // "width": 600,
      "height": 300,
      "curveType": "function"
    };


    // Instantiate and draw our chart, passing in some options.
    new this.w.google.visualization.LineChart(this.el)
      .draw(data, options);
  }
  }
