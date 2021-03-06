import "jest-preset-angular";

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {TranslateModule} from "@ngx-translate/core";

import { ButtonComponent } from './button.component';
import {IonicModule} from "@ionic/angular";

describe('shared-angular: ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonComponent ],
      imports: [ IonicModule.forRoot(), TranslateModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
