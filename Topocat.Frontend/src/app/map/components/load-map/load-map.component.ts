import { Component, OnInit } from '@angular/core';
import { MapStore } from '../../stores/map.store';
import { JsonSerializer } from '../../../infrastructure/json-serializer.service';
import { Map } from '../../../domain/map/map'

@Component({
    selector: 'tc-load-map',
    templateUrl: './load-map.component.html',
    styleUrls: ['./load-map.component.scss']
})
export class LoadMapComponent implements OnInit {

    constructor(private mapStore: MapStore,
                private jsonSerializer: JsonSerializer) {
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

                    component.mapStore.entity = component.jsonSerializer.deserialize(Map, text);
                }
            };

            reader.onload = onLoad(this, reader);
            reader.readAsText(file);
        }

        event.target.value = '';
    }

}
