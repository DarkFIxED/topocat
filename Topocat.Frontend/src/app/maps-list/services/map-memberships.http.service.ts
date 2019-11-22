import {Injectable} from '@angular/core';
import {AuthHttpService} from '../../core/services/auth.http.service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../../core/models/api.response';
import {MembershipListItemModel} from '../models/membership-list-item.model';
import {NewInviteModel} from '../models/new-invite.model';

@Injectable()
export class MapMembershipsHttpService {
    constructor(private authHttpService: AuthHttpService) {}

    getMapMemberships(mapId: string): Observable<ApiResponse<{memberships: MembershipListItemModel[]}>> {
        return this.authHttpService.get<ApiResponse<{memberships: MembershipListItemModel[]}>>(`map/${mapId}/memberships`);
    }

    createInvite(mapId: string, newInviteModel: NewInviteModel): Observable<ApiResponse<any>> {
        return this.authHttpService.post<ApiResponse<any>>(`map/${mapId}/invite`, newInviteModel);
    }

    cancelInvite(mapId: string, inviteId: string): Observable<ApiResponse<any>> {
        return this.authHttpService.delete<ApiResponse<any>>(`map/${mapId}/invite/${inviteId}`);
    }
}
