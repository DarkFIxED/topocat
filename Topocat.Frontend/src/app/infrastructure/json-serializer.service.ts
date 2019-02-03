import { JsonConvert, OperationMode, ValueCheckingMode } from 'json2typescript';
import { Injectable } from '@angular/core';

@Injectable()
export class JsonSerializer {

    private jsonConvert: JsonConvert;

    public constructor() {
        // Choose your settings
        // Check the detailed reference in the chapter "JsonConvert class properties and methods"
        this.jsonConvert = new JsonConvert();
        this.jsonConvert.operationMode = OperationMode.LOGGING; // print some debug data
        this.jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
        this.jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL; // never allow null
    }

    public deserialize<T>(json: string, classReference: new() => T): T {
        let jsonObject = JSON.parse(json);
        return this.fromAnonymous(jsonObject, classReference);
    }

    public serialize(object: any): string {
        let simplifiedObject = this.toAnonymous(object);
        return JSON.stringify(simplifiedObject);
    }

    public toAnonymous(object: any): any{
        return this.jsonConvert.serialize(object);
    }

    public fromAnonymous<T>(object: any, classReference: new() => T): T {
        return this.jsonConvert.deserialize(object, classReference);
    }
}