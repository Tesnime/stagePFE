import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../Services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { log } from 'console';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,CommonModule,MatIconModule,MatButtonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements  OnInit{
  selectedRole: string ='';
  hide = true;
  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  signupForm!:FormGroup;
  constructor(private router: Router,
    private fb:FormBuilder,
    private authService:AuthService,
    private snackBar:MatSnackBar) {}
  ngOnInit(): void {

    this.signupForm=this.fb.group({
      email:[null,[Validators.required,Validators.email]],
      password:[null,[Validators.required]],
      firstname:[null,[Validators.required]],
      lastname:[null,[Validators.required]],
    })
    // console.log(this.selectedRole)
  }

    

    onSubmit():void{
      
      if(this.selectedRole=="formateur"){
        this.authService.registerFormateur(this.signupForm.value).subscribe(
          (response)=>{
            this.snackBar.open('signup successfully','close',{duration:5000});
            this.router.navigateByUrl('/')
          },
          (error)=>{
            this.snackBar.open('signup failed,Please try again.','close',{duration:5000,panelClass:'error-snackbar'});
  
  
          }
        )
      }else if(this.selectedRole=="apprenant"){
        this.authService.registerApprenant(this.signupForm.value).subscribe(
          (response)=>{
            this.snackBar.open('signup successfully','close',{duration:5000});
            this.router.navigateByUrl('/')
          },
          (error)=>{
            this.snackBar.open('signup failed,Please try again.','close',{duration:5000,panelClass:'error-snackbar'});
  
  
          }
        )
      }else{
        this.snackBar.open('choisir votre role!','close',{duration:5000,panelClass:'error-snackbar'});

      }
      

    }

  

  navigateToSignIn() {
    this.router.navigate(['']); 
  }
}
