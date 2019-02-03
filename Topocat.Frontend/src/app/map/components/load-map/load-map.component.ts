import { Component, OnInit } from '@angular/core';
import { MapStore } from '../../stores/map.store';

@Component({
    selector: 'tc-load-map',
    templateUrl: './load-map.component.html',
    styleUrls: ['./load-map.component.scss']
})
export class LoadMapComponent implements OnInit {

    constructor(private mapStore: MapStore) {
    }

    ngOnInit() {
    }

    onFileChange(event) {
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];

            let onLoad = function (component: LoadMapComponent, reader: FileReader) {
                return function () {
                    let text = <string>reader.result;
                    let container = JSON.parse(text);
                    component.mapStore.import(container);
                };
            };

            reader.onload = onLoad(this, reader);
            reader.readAsText(file);
        }

        event.target.value = '';
    }

    onMergeFileChange(event) {
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];

            let onLoad = function (component: LoadMapComponent, reader: FileReader) {
                return function () {
                    let text = <string>reader.result;
                    let container = JSON.parse(text);
                    component.mapStore.merge(container);
                };
            };

            reader.onload = onLoad(this, reader);
            reader.readAsText(file);
        }

        event.target.value = '';
    }
}
