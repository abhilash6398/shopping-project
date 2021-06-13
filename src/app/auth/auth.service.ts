import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new Subject<User>();

  constructor(private http: HttpClient) { }

  signup(email:string,password:string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBATyfh56zuK-fUoY3d7veTIiZ9jEi79bc',
    {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError());
  }

  login(email: string,password: string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBATyfh56zuK-fUoY3d7veTIiZ9jEi79bc',
    {
      email: email,
      password: password,
      returnSecureToken: true
    });
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate= new Date(new Date().getTime()+expiresIn*1000);
    const user= new User(email,userId,token,expirationDate);
    this.user.next(user);



  }

  private handleError(errorRes: HttpErrorResponse){
    let errorMessage='An unknown error occured';
    if(!errorRes.error || !errorRes.error.error){
      return throwError(errorMessage);
    }
    switch(errorRes.error.error.message){
      case 'EMAIL EXISTS':
        errorMessage='This email already exists';
        break;
      case 'EMAIL NOT FOUND':
        errorMessage='This email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMessage='This password is invalid';
        break;
    }
    return throwError(errorMessage);
  }
}
