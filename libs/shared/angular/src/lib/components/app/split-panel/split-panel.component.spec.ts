import 'jest-preset-angular';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";
import {TranslateModule} from "@ngx-translate/core";

import { AppSplitPanelComponent } from './split-panel.component';

describe('SplitPanelComponent', () => {
  let component: AppSplitPanelComponent;
  let fixture: ComponentFixture<AppSplitPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSplitPanelComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ RouterTestingModule, TranslateModule.forRoot() ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSplitPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
