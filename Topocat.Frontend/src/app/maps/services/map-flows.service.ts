import {Injectable} from '@angular/core';
import {EditMapObjectFlow} from '../flows/edit-map-object.flow';
import {ObjectsDrawingFlow} from '../flows/objects-drawing.flow';
import {CreateMapObjectFlow} from '../flows/create-map-object.flow';
import {MapPositionFlow} from '../flows/map-position.flow';
import {ShowMapObjectPropertiesFlow} from '../flows/show-map-object-properties.flow';
import {MapRemovedFlow} from '../flows/map-removed.flow';
import {MapModeFlow} from '../flows/map-mode.flow';

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
                private showMapObjectPropertiesFlow: ShowMapObjectPropertiesFlow,
                private mapRemovedFlow: MapRemovedFlow,
                private mapModeFlow: MapModeFlow) {
    }

    setUp() {
        this.editMapObjectFlow.setUp();
        this.objectsDrawingFlow.setUp();
        this.createMapObjectFlow.setUp();
        this.mapPositionFlow.setUp();
        this.showMapObjectPropertiesFlow.setUp();
        this.mapRemovedFlow.setUp();
        this.mapModeFlow.setUp();
    }

}
