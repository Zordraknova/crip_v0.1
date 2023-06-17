import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthenticationService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // ngOnInit(): void {
  //   throw new Error('Method not implemented.');
  // }


  // loginForm!: FormGroup;
  // authService!: AuthenticationService;
  // router!: Router;
  // constructor(
  //   private authService: AuthenticationService,
  //   private formBuilder: FormBuilder,
  //   private router: Router
  // ) { }


  // ngOnInit(): void {
  //   this.loginForm = new FormGroup({
  //     email: new FormControl(null, [Validators.required, Validators.email, Validators.minLength(6)]),
  //     password: new FormControl(null, [Validators.required, Validators.minLength(3)])
  //   })
  // }

  // onSubmit() {
  //   if (this.loginForm.invalid) {
  //     return;
  //   }
  //   this.authService.login(this.loginForm.value).pipe(
  //     map(token => this.router.navigate(['admin']))
  //   ).subscribe()
  // }

  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  loginForm!: FormGroup;
  authService!: AuthenticationService;
  storageService!: StorageService;
  // constructor(private authService: AuthenticationService, private storageService: StorageService) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(this.loginForm.value).subscribe({
      next: (data: any) => {
        this.storageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.reloadPage();
      },
      error: (err: { error: { message: string; }; }) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}

