import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    let parsedUser = null;
    try {
      parsedUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing stored user data', error);
      localStorage.removeItem('user');
    }
    this.userSubject = new BehaviorSubject<any>(parsedUser);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): any {
    return this.userSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/token`;
    return this.http.post<any>(url, { email, password }).pipe(
      map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', user.token);
        this.userSubject.next(user);
        return user;
      }),
      catchError(this.handleError)
    );
  }

  register(data: any): Observable<any> {
    const url = `${this.apiUrl}/register`;
    return this.http.post<any>(url, data).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
