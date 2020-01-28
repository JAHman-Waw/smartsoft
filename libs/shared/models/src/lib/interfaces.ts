export enum FieldType {
    text = "text",
    password = "password",
    email = "email",
    flag = "flag",
    enum = "enum",
    currency = "currency",
    date = "date",
    object = "object"
}

export interface IModelMetadata {
    permissions: Array<string>;
}

export interface IFieldMetadata extends IFieldModifyMetadata {
    type?: FieldType;
    possibilities?: Array<any> | any;
}

export interface IFieldModifyMetadata {
    required?: boolean;
    focused?: boolean;
    confirm?: boolean;
}

export interface IFieldListMetadata {
    order?: number;
}

export interface IFieldDetailsMetadata {
    order?: number;
}

export interface IModelOptions {
    create?: any;
    update?: any;
    list?: any;
    details?: any;
    customs?: Array<any>;
}

export interface IFieldOptions extends IFieldMetadata {
    create?: IFieldModifyMetadata | boolean;
    update?: IFieldModifyMetadata | boolean;
    list?: IFieldListMetadata | boolean;
    details?: IFieldDetailsMetadata | boolean;
    customs?: Array<IModelMetadataCustom>;
}

export interface IModelMetadataCustom extends IModelMetadata {
    mode: string
}

export interface IFieldCustomMetadata extends IFieldModifyMetadata, IFieldListMetadata {
    mode: string;
}
