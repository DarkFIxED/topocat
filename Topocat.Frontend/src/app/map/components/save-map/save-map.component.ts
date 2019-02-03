import { Component, OnInit } from '@angular/core';
import { MapStore } from '../../stores/map.store';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'tc-save-map',
    templateUrl: './save-map.component.html',
    styleUrls: ['./save-map.component.scss']
})
export class SaveMapComponent implements OnInit {

    constructor(private mapStore: MapStore) {
    }

    ngOnInit() {
    }

    onSave() {
        let container = this.mapStore.export();
        let json = JSON.stringify(container);
        let blob = new Blob([json], {type: "application/json;charset=utf-8"});
        FileSaver.saveAs(blob, "map.json");
    }
}
