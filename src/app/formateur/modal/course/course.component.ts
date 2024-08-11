import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from 'express';
import { FormateurService } from '../../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent implements OnInit {
  
  coursForm!:FormGroup;

  constructor(private router: Router,
    private fb:FormBuilder,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar) {}
  
  ngOnInit(): void {
    this.coursForm=this.fb.group({
      nom: ['',Validators.required],
      cours: ['',Validators.required],
      theme: ['',Validators.required],
      description: ['']
      
    });
  }

  addcours():void{
  //   if(this.coursForm.valid){
  //     this.formateurService.addCours(this.coursForm.value).subscribe((res)=>{
  //       if(res.id != null){
  //         this.snackBar.open('ajout avec succes!','close',{duration:5000});
  //         // this.router.navigateByUrl('formateur/home');
  //         window.location.reload();
  //       }
  //       else{
  //         this.snackBar.open('signup failed,Please try again.','close',{duration:5000,panelClass:'error-snackbar'});
  //       }
  //     })
  //   }else{
  //     this.coursForm.markAllAsTouched();
  //   }
  }


}
