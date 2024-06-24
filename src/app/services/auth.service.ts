import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<any>(null);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): any {
    return this.userSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/token`;
    return this.http.post<any>(url, { email, password }).pipe(
      map((response: any) => {
        const user = response.user; // Ajuste conforme a estrutura da resposta da API
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      })
    );
  }

  register(userData: any): Observable<any> {
    const url = `${this.apiUrl}/signup`; // Ajuste conforme a rota de registro da sua API
    return this.http.post<any>(url, userData);
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getToken(): string | null {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token ?? null;
}

}
