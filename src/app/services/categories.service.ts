import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Importe o AuthService aqui

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = 'http://localhost:8000'; // Ajuste conforme sua API

  constructor(
    private http: HttpClient,
    private authService: AuthService // Injete o AuthService no construtor
  ) {}

  createCategory(name: string, description: string): Observable<any> {
    const url = `${this.apiUrl}/categories`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.getToken()}` // Obtenha o token do AuthService
    });

    return this.http.post<any>(url, { name, description }, { headers });
  }
}
