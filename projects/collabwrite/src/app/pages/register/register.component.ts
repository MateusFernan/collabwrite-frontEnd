import { Component } from '@angular/core';
import { LandingPageComponent } from '../../components/landing-page/landing-page.component';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [LandingPageComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  login = false;
  loading = false;
  successMessage = '';
  errorMessage = '';
  form: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _router: Router
  ) {
    this.form = this._fb.group({
      name: this._fb.nonNullable.control(
        '',
        this.login ? [Validators.required] : []
      ),
      email: this._fb.nonNullable.control('', [
        Validators.required,
        Validators.email,
      ]),
      password: this._fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const { name, email, password } = this.form.getRawValue();
    if (!this.login) {
      this._auth.register(name, email, password).subscribe({
        next: () => {
          this.successMessage = 'Conta criada com sucesso!';
          this.form.reset();
        },
        complete: () => {
          this.loading = false;
          this._router.navigate(['/documents']);
        },
        error: (err) => {
          this.errorMessage = err?.error?.message ?? 'Erro ao criar conta.';
          this.loading = false;
        },
      });
    } else {
      this._auth.login(email, password).subscribe({
        next: () => {
          this.successMessage = 'Sucesso';
          this.form.reset();
        },
        complete: () => {
          this.loading = false;
          this._router.navigate(['/documents']);
        },
        error: (err) => {
          this.errorMessage = err?.error?.message ?? 'Erro ao entrar';
          this.loading = false;
        },
      });
    }
  }

  setarLogin(): void {
    this.login = !this.login;
  }
}
