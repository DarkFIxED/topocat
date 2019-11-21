import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticateHttpService} from '../../services/authenticate.http.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

    forgotPasswordForm = new FormGroup({
        email: new FormControl(undefined, [Validators.email, Validators.required])
    });

    loading = false;

    showSuccessMessage = false;

    constructor(private authenticateHttpService: AuthenticateHttpService,
                private router: Router) {
    }

    ngOnInit() {
    }

    onFormSubmit() {
        const data = this.forgotPasswordForm.value;

        this.loading = true;
        this.authenticateHttpService.restorePasswordRequest(data).subscribe(result => {

            this.loading = false;

            if (!result.isSuccessful) {
                this.forgotPasswordForm.setErrors({server: result.message});
                return;
            }

            this.showSuccessMessage = true;
            setTimeout(() => {
                this.router.navigateByUrl('/login');
            }, 5000);
        });
    }
}
