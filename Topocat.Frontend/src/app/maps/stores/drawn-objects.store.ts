import {UnifiedMapObject} from '../models/unified-map-object';
import {ID} from '@datorama/akita';
import {Subject, Subscription} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class DrawnObjectsStore {
    drawnObjects: UnifiedMapObject[] = [];
    drawnObjectsSubscriptions: { id: ID, subscriptions: Subscription[] }[] = [];

    objectAdded$ = new Subject<UnifiedMapObject>();

    add(unifiedMapObject: UnifiedMapObject) {
        this.drawnObjects.push(unifiedMapObject);
        this.drawnObjectsSubscriptions.push({
            id: unifiedMapObject.id,
            subscriptions: []
        });

        this.objectAdded$.next(unifiedMapObject);
    }

    addSubscription(id: ID, subs: Subscription) {
        const foundSubs = this.drawnObjectsSubscriptions.find(x => x.id === id);
        if (!foundSubs)
            throw new Error();

        foundSubs.subscriptions.push(subs);
    }

    remove(id: ID) {
        const subs = this.drawnObjectsSubscriptions.find(x => x.id === id);
        if (!subs) {
            throw new Error();
        }

        subs.subscriptions.forEach(sub => sub.unsubscribe());
        let index = this.drawnObjectsSubscriptions.indexOf(subs);
        this.drawnObjectsSubscriptions.splice(index, 1);

        index = this.drawnObjects.findIndex(x => x.id === id);
        this.drawnObjects[index].dispose();
        this.drawnObjects.splice(index, 1);
    }
}
