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

    public deserialize<T>(classReference: new() => T, json: string): T {
        return this.jsonConvert.deserialize(json, classReference);
    }

    public serialize(object: any): string {
        let simplifiedObject = this.jsonConvert.serialize(object);
        return JSON.stringify(simplifiedObject);
    }
}