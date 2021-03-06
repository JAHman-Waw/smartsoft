import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {Store, StoreModule} from "@ngrx/store";
import {SocketIoModule} from "ngx-socket-io";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {SharedModule} from "@smartsoft001/angular";
import {IEntity} from "@smartsoft001/domain-core";

import {CrudConfig} from "./crud.config";
import {CrudEffects} from "./+state/crud.effects";
import {getReducer} from "./+state/crud.reducer";
import {ListComponent} from "./pages/list/list.component";
import {ItemComponent} from "./pages/item/item.component";
import {CrudPipesModule} from "./pipes/pipes.module";
import { CrudService } from './services/crud/crud.service';
import { CrudFacade } from './+state/crud.facade';
import {SocketService} from "./services/socket/socket.service";
import {ExportComponent} from "./components/export/export.component";
import {FiltersComponent} from "./components/filters/filters.component";
import {FilterComponent} from "./components/filter/filter.component";
import {FilterTextComponent} from "./components/filter/text/text.component";
import {FiltersConfigComponent} from "./components/filters-config/filters-config.component";
import {FilterDateComponent} from "./components/filter/date/date.component";
import {FilterDateWithEditComponent} from "./components/filter/date-with-edit/date-with-edit.component";
import {FilterRadioComponent} from "./components/filter/radio/radio.component";

const COMPONENTS = [
    ItemComponent,
    ListComponent,
    ExportComponent,
    FilterComponent,
    FilterTextComponent,
    FiltersConfigComponent,
    FilterDateComponent,
    FilterDateWithEditComponent,
    FilterRadioComponent,
    FiltersComponent
];

@NgModule({
    declarations: [
        ...COMPONENTS
    ],
    entryComponents: [
        ...COMPONENTS
    ],
    imports: [
        StoreModule,
        SharedModule,
        CrudPipesModule,
        SocketIoModule,
        RouterModule.forChild([
            {path: '', component: ListComponent}
            , {path: 'add', component: ItemComponent}
            , {path: ':id', component: ItemComponent}
        ]),
        FormsModule,
        CommonModule
    ],
    exports: [
        ItemComponent,
        ListComponent,
        ExportComponent,
        CrudPipesModule
    ],
    providers: [CrudService, CrudEffects, CrudFacade, SocketService]
})
export class CrudFullModule<T extends IEntity<string>> {
    constructor(store: Store<any>, config: CrudConfig<T>, effects: CrudEffects<any>) {
        store.addReducer(config.entity, getReducer(config.entity));
        effects.init();
    }
}
