import * as signalR from '@aspnet/signalr';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, Subject} from 'rxjs';
import {MapObjectModel} from '../models/map-object.model';
import {ID} from '@datorama/akita';

export class MapsSignalRService {

    private isConnected = new BehaviorSubject<boolean>(false);
    isConnected$ = this.isConnected.asObservable();

    private objectUpdated = new Subject<MapObjectModel>();
    objectUpdated$ = this.objectUpdated.asObservable();

    private objectRemoved = new Subject<ID>();
    objectRemoved$ = this.objectRemoved.asObservable();

    private hubConnection: signalR.HubConnection;

    constructor() {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.serverUrl}mapHub`)
            .build();


        this.hubConnection.onclose(error => {
            setTimeout(() => this.startConnection(), 5000);
        });
    }

    startConnection() {
        this.hubConnection
            .start()
            .then(() => {
                console.log('Connection started');
                this.isConnected.next(true);
            })
            .catch(err => {
                console.log('Error while starting connection: ' + err);
                this.isConnected.next(false);
            });

        this.hubConnection.on('objectUpdated', (data) => {
            console.log(data);
            this.objectUpdated.next(data);
        });

        this.hubConnection.on('objectRemoved', (id) => {
            console.log(id);
            this.objectRemoved.next(id);
        });
    }

    initialize(mapId: string) {
        this.hubConnection.send('Initialize', mapId)
            .then()
            .catch(catchError);
    }
}

function catchError(err) {
    console.error(err);
}
