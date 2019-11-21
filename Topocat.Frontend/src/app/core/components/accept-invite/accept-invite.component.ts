import {Component, OnInit} from '@angular/core';
import {BaseHttpService} from '../../services/base.http.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiResponse} from '../../models/api.response';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-accept-invite',
    templateUrl: './accept-invite.component.html',
    styleUrls: ['./accept-invite.component.scss']
})
export class AcceptInviteComponent implements OnInit {

    acceptInviteForm = new FormGroup({
        accept: new FormControl(undefined, [Validators.required])
    });

    loading = false;
    mapId = '';
    inviteId = '';
    showSuccessMessage = false;

    constructor(private baseHttpService: BaseHttpService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.mapId = params.mapId;
            this.inviteId = params.inviteId;
        });
    }

    onFormSubmit() {
        if (this.acceptInviteForm.invalid) {
            return;
        }

        this.loading = true;
        this.baseHttpService.put<ApiResponse<any>>(`map/${this.mapId}/invite/${this.inviteId}`, this.acceptInviteForm.value)
            .subscribe(result => {
                    this.loading = false;
                    this.showSuccessMessage = true;
                    setTimeout(() => {
                        this.router.navigateByUrl('/');
                    }, 5000);

                }
            );
    }
}
