import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticateHttpService} from '../../services/authenticate.http.service';

@Component({
    selector: 'app-restore-password',
    templateUrl: './restore-password.component.html',
    styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit {

    constructor(private route: ActivatedRoute,
                private authenticateHttpService: AuthenticateHttpService,
                private router: Router) {
    }

    restorePasswordForm = new FormGroup({
        token: new FormControl(undefined, [Validators.required]),
        email: new FormControl(undefined, [Validators.email, Validators.required]),
        password: new FormControl(undefined, [Validators.required]),
        repeatPassword: new FormControl(undefined, [Validators.required])
    }, [this.checkPasswords]);

    loading = false;

    showSuccessMessage = false;

    checkPasswords(group: FormGroup) {
        const pass = group.get('password').value;
        const confirmPass = group.get('repeatPassword').value;

        return pass === confirmPass ? null : {passwordsMismatch: true};
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.restorePasswordForm.patchValue({
                token: params.token,
                email: params.email
            });
        });
    }

    onFormSubmit() {
        if (this.restorePasswordForm.invalid) {
            return;
        }

        const formValue = this.restorePasswordForm.value;

        const data = {
            token: formValue.token,
            email: formValue.email,
            password: formValue.password
        };

        this.loading = true;
        this.authenticateHttpService.resetPassword(data)
            .subscribe(result => {
                this.loading = false;

                if (!result.isSuccessful) {
                    this.restorePasswordForm.setErrors({server: result.message});
                    return;
                }

                this.showSuccessMessage = true;
                setInterval(() => {
                    this.router.navigateByUrl('/login');
                }, 5000);
            });
    }
}
