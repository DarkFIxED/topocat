import {FormGroup} from '@angular/forms';

export class CheckPasswordsValidator {
    static checkPasswords(group: FormGroup) {
        const pass = group.get('password').value;
        const confirmPass = group.get('repeatPassword').value;

        return pass === confirmPass ? null : {passwordsMismatch: true};
    }
}
