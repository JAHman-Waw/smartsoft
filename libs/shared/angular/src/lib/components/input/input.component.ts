import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver, Injector,
  Input,
  OnInit, ViewChild,
  ViewContainerRef
} from '@angular/core';
import * as _ from 'lodash';

import {InputOptions} from "../../models/interfaces";
import {FieldType, getModelFieldOptions, IFieldOptions} from "@smartsoft001/models";
import {InputBaseComponent} from "./base/base.component";

@Component({
  selector: 'smart-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent<T> implements OnInit {

  private _options: InputOptions<T>;

  fieldOptions: IFieldOptions;
  FieldType = FieldType;

  @ViewChild('componentRef', {read: ViewContainerRef}) componentRef: ViewContainerRef;

  @Input() set options(val: InputOptions<T>) {
    this._options = val;
    let key = this._options.fieldKey;

    if (key && key.endsWith('Confirm')) {
      key = key.replace('Confirm', '');
    }

    let fieldOptions = getModelFieldOptions(this._options.model, key);

    if (val.mode === 'create' && _.isObject(fieldOptions.create)) {
      fieldOptions = {
        ...fieldOptions,
        ...(fieldOptions.create as IFieldOptions)
      };
    } else if (val.mode === 'update' && _.isObject(fieldOptions.update)) {
      fieldOptions = {
        ...fieldOptions,
        ...(fieldOptions.update as IFieldOptions)
      };
    }

    this.fieldOptions = fieldOptions;

    this.initCustomComponent();
  }
  get options(): InputOptions<T> {
    return this._options;
  }

  constructor(
      private componentFactoryResolver: ComponentFactoryResolver,
      private injeector: Injector
  ) { }

  ngOnInit() {
  }

  private async initCustomComponent(): Promise<void> {
    if (!this.options.component) return;

    await new Promise(res => res());

    const componentFactory = this.componentFactoryResolver
        .resolveComponentFactory<InputBaseComponent<any>>(this.options.component);

    const viewContainerRef = this.componentRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory, 0, this.injeector);

    componentRef.instance.options = this.options;
    componentRef.instance.fieldOptions = this.fieldOptions;
  }
}
