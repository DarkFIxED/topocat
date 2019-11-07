import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticateHttpService} from '../../services/authenticate.http.service';
import {CredentialsStore} from '../../stores/credentials.store';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm = new FormGroup({
        email: new FormControl(undefined, [Validators.required, Validators.email]),
        password: new FormControl(undefined, [Validators.required])
    });

    loading = false;

    constructor(private authenticateHttpService: AuthenticateHttpService,
                private credentialsStore: CredentialsStore) {
    }

    ngOnInit() {
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
        });
    }
}
