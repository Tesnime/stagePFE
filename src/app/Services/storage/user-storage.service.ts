import { Injectable } from '@angular/core';

const TOKEN="ecom-token";
const USER="ecom-user";

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() { }

  public saveToken(token:string):void{
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN,token);
  }

  public saveUser(user:any):void{
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER,JSON.stringify(user));

  }
  
  static getToken():string | null{
    return window.localStorage.getItem(TOKEN);
  }

  static getUser(): any | null {
    const userString = window.localStorage.getItem(USER);
    return userString ? JSON.parse(userString) : null;
}

  static getUserId():string{
    const user=this.getUser();
    if (user == null){ 
      return '';
    }
    return user.userId;
  }

  
  static getUserRole():string{
    const user=this.getUser();
    if (user== null){
      return '';
    }
    return user.role;
  }

  
  static isAdminLoggedIn(): boolean{
    if(this.getToken === null){
      return false;
    }
    const role: string=this.getUserRole();
    return role=='ADMIN';
  }

  static isFormateurLoggedIn(): boolean{
    if(this.getToken === null){
      return false;
    }
    const role: string=this.getUserRole();
    return role=='FORMATEUR';
  }

  static isApprenantLoggedIn(): boolean{
    if(this.getToken === null){
      return false;
    }
    const role: string=this.getUserRole();
    return role=='APPRENANT';
  }

  static SignOut(): void{
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }
}
