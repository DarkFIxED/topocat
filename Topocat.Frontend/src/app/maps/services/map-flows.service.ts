import {Injectable} from '@angular/core';
import {EditMapObjectFlow} from '../flows/edit-map-object.flow';
import {ObjectsDrawingFlow} from '../flows/objects-drawing.flow';
import {CreateMapObjectFlow} from '../flows/create-map-object.flow';
import {MapPositionFlow} from '../flows/map-position.flow';
import {ShowMapObjectPropertiesFlow} from '../flows/show-map-object-properties.flow';

/*
Service which used as facade to include required data flows into map.component.
Created to reduce dependencies.
 */
@Injectable()
export class MapFlowsService {

    constructor(private editMapObjectFlow: EditMapObjectFlow,
                private objectsDrawingFlow: ObjectsDrawingFlow,
                private createMapObjectFlow: CreateMapObjectFlow,
                private mapPositionFlow: MapPositionFlow,
                private showMapObjectPropertiesFlow: ShowMapObjectPropertiesFlow) {
    }

    setUp() {
        this.editMapObjectFlow.setUp();
        this.objectsDrawingFlow.setUp();
        this.createMapObjectFlow.setUp();
        this.mapPositionFlow.setUp();
        this.showMapObjectPropertiesFlow.setUp();
    }

}
