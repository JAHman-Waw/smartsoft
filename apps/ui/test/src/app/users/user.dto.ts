import {Field, FieldType, IFieldModifyMetadata, Model} from "@smartsoft001/models";
import {IEntity} from "@smartsoft001/domain-core";

const modifyMetdata : IFieldModifyMetadata = {
    required: true,
};

export enum UserPermission {
    admin = "admin",
    test = "test",
    test2 = "test2",
    test3 = "test3"
}

@Model({})
export class UserInfo {
    @Field({ details: true }) info1 = 'Test info 1';
    @Field({ details: true }) info2 = 'Test info 2';
}

@Model({
    titleKey: 'username'
})
export class User implements IEntity<string> {
    id: string;

    @Field({
        create: {
            required: true,
            permissions: [ 'admin2' ]
        },
        update: modifyMetdata,
        details: true,
        list: { order: 3, permissions: [ 'admin' ] }
    })
    firstName: string;

    @Field({
        create: modifyMetdata,
        update: {
            required: true,
            permissions: [ 'admin2' ]
        },
        details: true,
        list: { order: 2 }
    })
    lastName: string;

    @Field({
        create: modifyMetdata,
        details: {
            permissions: [ 'admin2' ]
        },
        unique: true,
        list: { order: 1 }
    })
    username: string;

    @Field({
        details: true,
        type: FieldType.object,
        classType: UserInfo
    })
    info: UserInfo;

    @Field({
        create: {
            ...modifyMetdata,
            confirm: true
        },
        customs: [
            { mode: 'changePassword' }
        ]
    })
    password: string;

    @Field({
        update: true,
        details: true,
        type: FieldType.flag
    })
    disabled: boolean;

    @Field({
        create: {
            ...modifyMetdata,
            required: false
        },
        update: {
            ...modifyMetdata,
            required: false
        },
        details: true,
        type: FieldType.enum,
        possibilities: UserPermission
    })
    permissions: Array<UserPermission>;

    @Field({
        create: {
            ...modifyMetdata,
            required: false
        },
        update: {
            ...modifyMetdata,
            required: false
        },
        details: true,
        type: FieldType.radio,
        possibilities: UserPermission
    })
    permissions2: Array<UserPermission>;

    @Field({
        create: modifyMetdata,
        update: modifyMetdata,
        details: true,
        type: FieldType.email
    })
    email: string;

    @Field({
        create: modifyMetdata,
        update: modifyMetdata,
        details: true,
        type: FieldType.dateWithEdit
    })
    date: string;

    @Field({
        create: modifyMetdata,
        update: modifyMetdata,
        details: true,
        type: FieldType.int
    })
    year: number;

    @Field({
        create: modifyMetdata,
        update: modifyMetdata,
        type: FieldType.file
    })
    file: File;

    @Field({
        customs: [
            { mode: 'changePassword' }
        ],
        type: FieldType.radio
    })
    mode: string;

    constructor() {
        this.info = new UserInfo();
    }
}
