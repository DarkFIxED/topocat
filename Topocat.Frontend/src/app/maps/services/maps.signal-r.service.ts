import * as signalR from '@aspnet/signalr';
import {environment} from '../../../environments/environment';
import {BehaviorSubject} from 'rxjs';

export class MapsSignalRService {

    private isConnected = new BehaviorSubject<boolean>(false);
    isConnected$ = this.isConnected.asObservable();

    private hubConnection: signalR.HubConnection;

    constructor() {
    }

    startConnection() {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.serverUrl}mapHub`)
            .build();

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
        });
    }

    initialize(mapId: string) {
        this.hubConnection.send('Initialize', mapId)
            .then()
            .catch(catchError)
        ;
    }
}

function catchError(err) {
    console.error(err);
}
