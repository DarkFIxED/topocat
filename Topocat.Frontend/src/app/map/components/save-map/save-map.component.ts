import { Component, OnInit } from '@angular/core';
import { MapStore } from '../../stores/map.store';
import { JsonSerializer } from '../../../infrastructure/json-serializer.service';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'tc-save-map',
    templateUrl: './save-map.component.html',
    styleUrls: ['./save-map.component.scss']
})
export class SaveMapComponent implements OnInit {

    constructor(private mapStore: MapStore,
                private json: JsonSerializer) {
    }

    ngOnInit() {
    }

    onSave() {
        let serializedEntity = this.json.serialize(this.mapStore.entity);

        let blob = new Blob([serializedEntity], {type: "application/json;charset=utf-8"});
        FileSaver.saveAs(blob, "map.json");
    }
}
