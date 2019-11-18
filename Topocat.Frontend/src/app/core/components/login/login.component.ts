import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticateHttpService} from '../../services/authenticate.http.service';
import {CredentialsStore} from '../../stores/credentials.store';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {BaseDestroyable} from '../../services/base-destroyable';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseDestroyable implements OnInit {

    loginForm = new FormGroup({
        email: new FormControl(undefined, [Validators.required, Validators.email]),
        password: new FormControl(undefined, [Validators.required])
    });

    loading = false;

    constructor(private authenticateHttpService: AuthenticateHttpService,
                private credentialsStore: CredentialsStore,
                private router: Router,
                private route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.route.paramMap
            .pipe(
                map(() => window.history.state)
            ).subscribe(state => {
                const email = state.email;
                if (!!email) {
                   this.loginForm.patchValue({email});
                }
            });
    }

    onFormSubmit() {
        this.loginForm.setErrors(null);

        if (this.loginForm.invalid) {
            return;
        }

        const data = this.loginForm.value;

        this.loading = true;

        this.authenticateHttpService.login(data).subscribe(result => {
            this.loading = false;
            if (!result.isSuccessful) {
                this.loginForm.setErrors({server: result.message});
                return;
            }

            this.credentialsStore.updateTokenPair(result.data);
            this.router.navigateByUrl('/maps-list');
        });
    }
}
