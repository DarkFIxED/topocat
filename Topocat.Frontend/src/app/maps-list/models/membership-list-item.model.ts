import {MapMembershipStatus} from './map-membership.status';

export class MembershipListItemModel {
    id: string;
    invitedEmail: string;
    status: MapMembershipStatus;
    createdAt: Date;
}
