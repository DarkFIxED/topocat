import {UserModel} from './user.model';

export class MapModel {
    id: string;
    title: string;
    createdAt: Date;
    lastModifiedAt: Date;
    createdBy: UserModel;
}
