import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  loginForm: any;
  isLogin: boolean = true;
  errorMessage: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submitForm() {
    if (this.loginForm.invalid) return;
    this.isLogin ? this.login() : this.register();
  }

  login() {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(
        () => {},
        (err) => {
          console.log(err);
          if(err.error.error.message === 'EMAIL_NOT_FOUND')
            this.errorMessage = "Nu există cont asociat cu această adresă de e-mail";
        }
      );
  }

  register() {
    this.authService.register(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(
        () => {},
        (err) => {
          if(err.error.error.message === 'EMAIL_EXISTS')
            this.errorMessage = "Adresa de e-mail este deja folosită";
        }
      );
  }

  switchLogin() {
    this.isLogin = !this.isLogin;
    this.errorMessage = undefined;
  }
}
