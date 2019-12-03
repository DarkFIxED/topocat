import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'suppressNull'})
export class SuppressNullPipe implements PipeTransform {
    transform(value: string, ...args: any[]): string {
        if (value == null)
            return '';

        return value;
    }

}
