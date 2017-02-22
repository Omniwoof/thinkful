/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MakepollComponent } from './makepoll.component';

describe('MakepollComponent', () => {
  let component: MakepollComponent;
  let fixture: ComponentFixture<MakepollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakepollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakepollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
