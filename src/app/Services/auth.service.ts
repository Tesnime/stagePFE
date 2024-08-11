import { UserStorageService } from './storage/user-storage.service';
import { StringValueToken } from './../../../node_modules/html2canvas/dist/types/css/syntax/tokenizer.d';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap, tap } from 'rxjs';

const URL="http://localhost:8080/api/auth/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

token:any;
  constructor(private http:HttpClient,
    private userStorageService:UserStorageService) { }

  registerFormateur(SignUpRequest:any): Observable<any>{
    return this.http.post(URL+'signup/formateur',SignUpRequest);
  }
  isExpired():Observable<any>{
    this.token = UserStorageService.getToken();
    return this.http.get<any>(URL+'token?token='+this.token).pipe(
      map(response => response)
    )
  }
  registerApprenant(SignUpRequest:any): Observable<any>{
    return this.http.post(URL+'signup/apprenant',SignUpRequest);
  }
  
  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { email, password };
  
    return this.http.post(URL + 'signin', body, { headers, observe: 'response' }).pipe(
      switchMap((res) => {
        const token = res.headers.get('Authorization')?.substring(7);
  
        return this.http.get<any>(URL + 'user-details?email=' + email).pipe(
          map((userResponse) => {
            const user = { userId: userResponse.id,
               role: userResponse.role
              };
           
  
            if (token && user) {
              this.userStorageService.saveToken(token);
              this.userStorageService.saveUser(user);
              return true;
            }
  
            return false;
          })
        );
      })
    );
  }
}  
