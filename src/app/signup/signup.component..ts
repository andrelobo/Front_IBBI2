import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading = false;
  submitted = false;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Método conveniente para fácil acesso aos campos do formulário
  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // Parar aqui se o formulário for inválido
    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(this.signupForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(['/login']);
        },
        (error) => {
          this.error = error.message; // Defina a mensagem de erro conforme a necessidade da sua API
          this.loading = false;
        }
      );
  }
}
