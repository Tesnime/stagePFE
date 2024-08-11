import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { UserStorageService } from '../../Services/storage/user-storage.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,HttpClientModule,CommonModule,MatIconModule,MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  hide = true;
  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }
  loginForm!:FormGroup;
  constructor(private router: Router,
    private fb:FormBuilder,
    private authService:AuthService,
    private snackBar:MatSnackBar) {}

    ngOnInit(): void {

      this.loginForm=this.fb.group({
        email:[null,[Validators.required,Validators.email]],
        password:[null,[Validators.required]]
      })
    }
    onSubmit():void{
      const  email=this.loginForm.get('email')?.value;
      const  password=this.loginForm.get('password')?.value;

      this.authService.login(email,password).subscribe(
        (res)=> {
          // this.snackBar.open('login succes','OK',{duration:5000})
          if(UserStorageService.isAdminLoggedIn()){
            this.router.navigateByUrl('admin/home');
            // window.location.reload();
          }else if(UserStorageService.isApprenantLoggedIn()){
            this.router.navigateByUrl('apprenant/home');

          }else if(UserStorageService.isFormateurLoggedIn()){
            this.router.navigateByUrl('formateur/home');

          }

        },
        (error)=>{
          this.snackBar.open('error','ERROR',{duration:5000})
        }
      )
    }

  navigateToSignUp() {
    this.router.navigate(['signup']); 
  }

}
