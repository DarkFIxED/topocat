import {Component, OnInit} from '@angular/core';
import {filter, switchMap, tap} from 'rxjs/operators';
import {MapMembershipsHttpService} from '../../services/map-memberships.http.service';
import {MembershipListItemModel} from '../../models/membership-list-item.model';
import {ActivatedRoute} from '@angular/router';
import {MapMembershipStatus} from '../../models/map-membership.status';
import {MatDialog} from '@angular/material';
import {NewInviteComponent} from '../new-invite/new-invite.component';

@Component({
    selector: 'app-membership-list',
    templateUrl: './membership-list.component.html',
    styleUrls: ['./membership-list.component.scss']
})
export class MembershipListComponent implements OnInit {

    MapMembershipStatus = MapMembershipStatus;

    loading = false;
    memberships: MembershipListItemModel[] = [];

    displayedColumns: string[] = ['email', 'createdAt'];

    mapId: string = undefined;

    constructor(private mapMembershipsHttpService: MapMembershipsHttpService,
                private route: ActivatedRoute,
                private dialog: MatDialog) {
    }

    ngOnInit() {
        this.route.params.subscribe(result => {
            if (result.id) {
                this.mapId = result.id;
                this.load(this.mapId);
            } else {
                this.mapId = undefined;
            }
        });
    }

    load(mapId: string) {
        this.loading = true;
        this.mapMembershipsHttpService.getMapMemberships(mapId)
            .pipe(
                tap(() => this.loading = false)
            )
            .subscribe(result => {
                if (!result.isSuccessful) {
                    throw new Error(result.message);
                }

                this.memberships = [...result.data.memberships];
            });
    }

    openInviteDialog() {
        const dialogRef = this.dialog.open(NewInviteComponent, {
            width: '250px',
            hasBackdrop: true
        });

        dialogRef.afterClosed()
            .pipe(
                filter(result => !!result),
                switchMap(result => this.mapMembershipsHttpService.createInvite(this.mapId, result))
            )
            .subscribe(result => {
                if (result.isSuccessful)
                    this.load(this.mapId);
                else
                // TODO: handle error
                    throw new Error();
            });
    }

    getStatusDescription(status: MapMembershipStatus) {
        switch (status) {
            case MapMembershipStatus.Accepted:
                return 'Invite accepted';
            case MapMembershipStatus.Declined:
                return 'Invite declined';
            case MapMembershipStatus.DecisionNotMade:
                return 'Decision not made';
            default :
                throw new Error();
        }
    }
}
