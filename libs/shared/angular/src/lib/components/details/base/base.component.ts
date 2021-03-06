import {
  AfterViewInit,
  Input,
  ViewChild,
  ViewContainerRef,
  Directive,
} from "@angular/core";
import { Observable } from "rxjs";

import {
  getModelFieldsWithOptions,
  IFieldDetailsMetadata,
  IFieldOptions,
} from "@smartsoft001/models";
import { IEntity } from "@smartsoft001/domain-core";

import { IDetailsComponentFactories, IDetailsOptions } from "../../../models";
import { AuthService } from "../../../services/auth/auth.service";
import {map} from "rxjs/operators";
import {ObjectService} from "@smartsoft001/utils";

@Directive()
export abstract class DetailsBaseComponent<T extends IEntity<string>>
  implements AfterViewInit {
  private _fields: Array<{ key: string; options: IFieldOptions }>;
  private _type: any;

  componentFactories: IDetailsComponentFactories<T>;

  get fields(): Array<{ key: string; options: IFieldOptions }> {
    return this._fields;
  }

  get type(): any {
    return this._type;
  }

  item$: Observable<T>;
  loading$: Observable<boolean>;

  @ViewChild("topTpl", { read: ViewContainerRef, static: true })
  topTpl: ViewContainerRef;

  @ViewChild("bottomTpl", { read: ViewContainerRef, static: true })
  bottomTpl: ViewContainerRef;

  @Input() set options(obj: IDetailsOptions<T>) {
    this._type = obj.type;
    this._fields = getModelFieldsWithOptions(new this._type())
      .filter((f) => f.options.details)
      .filter((field) => {
        if (
          (field.options.details as IFieldDetailsMetadata).permissions &&
          !this.authService.expectPermissions(
            (field.options.details as IFieldDetailsMetadata).permissions
          )
        ) {
          return false;
        }

        return true;
      });
    this.item$ = obj.item$.pipe(
        map(item => {
          if (!item) return item;

          if (item instanceof obj.type) return item;

          return ObjectService.createByType(item, obj.type);
        })
    );
    this.loading$ = obj.loading$;
    this.componentFactories = obj.componentFactories;

    this.generateDynamicComponents();
  }

  constructor(private authService: AuthService) {}

  ngAfterViewInit(): void {
    this.generateDynamicComponents();
  }

  protected generateDynamicComponents(): void {
    if (!this.componentFactories) return;

    if (this.componentFactories.top && this.topTpl) {
      if (!this.topTpl.get(0)) {
        this.topTpl.createComponent(this.componentFactories.top);
      }
    }

    if (this.componentFactories.bottom && this.bottomTpl) {
      if (!this.bottomTpl.get(0)) {
        this.bottomTpl.createComponent(this.componentFactories.bottom);
      }
    }
  }
}
