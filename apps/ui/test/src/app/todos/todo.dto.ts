import {Field, FieldType, IFieldModifyMetadata, Model} from "@smartsoft001/models";
import {IEntity} from "@smartsoft001/domain-core";
import {of} from "rxjs";

const modifyMetdata : IFieldModifyMetadata = {
    required: true
};

@Model({
    filters: [
        {
            label: 'testNegation',
            key: 'body',
            type: '!=',
        },
        {
            label: 'fromDate',
            key: 'createDate',
            type: '<=',
            fieldType: FieldType.dateWithEdit
        },
        {
            label: 'select',
            key: 'type',
            type: '=',
            fieldType: FieldType.radio,
            possibilities$: of([
                {
                    id: 1, text: 'Test 1'
                },
                {
                    id: 2, text: 'Test 2'
                }
            ])
        }
    ]
})
export class Todo implements IEntity<string> {
    id: string;

    @Field({
        create: modifyMetdata,
        update: modifyMetdata,
        details: true,
        list: { order: 1, filter: true }
    })
    number: string;

    @Field({
        create: modifyMetdata,
        update: modifyMetdata,
        details: true,
        list: { order: 2 }
    })
    body: string;

    @Field({
        create: modifyMetdata,
        update: modifyMetdata,
        details: true,
        list: { order: 3 }
    })
    done: string;
}
