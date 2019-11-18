import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CheckPasswordsValidator} from '../../validators/check-passwords.validator';
import {BaseHttpService} from '../../services/base.http.service';
import {ApiResponse} from '../../models/api.response';
import {AuthenticateHttpService} from '../../services/authenticate.http.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

    signUpForm = new FormGroup({
        email: new FormControl(undefined, [Validators.email, Validators.required]),
        password: new FormControl(undefined, [Validators.required]),
        repeatPassword: new FormControl(undefined, [Validators.required])
    }, [CheckPasswordsValidator.checkPasswords]);

    loading = false;

    constructor(private authenticateHttpService: AuthenticateHttpService,
                private router: Router) {
    }

    ngOnInit() {
    }

    onFormSubmit() {
        this.signUpForm.setErrors(null);

        if (this.signUpForm.invalid) {
            return;
        }

        const data = {
            email: this.signUpForm.value.email,
            password: this.signUpForm.value.password
        };
        this.loading = true;

        this.authenticateHttpService.signUp(data).subscribe(result => {
            this.loading = false;
            if (!result.isSuccessful) {
                this.signUpForm.setErrors({server: result.message});
                return;
            }

            this.router.navigateByUrl('/login', {
                state: {
                    email: data.email
                }
            });
        });
    }
}
