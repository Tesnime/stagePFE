import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FormateurService } from '../../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@Component({ 
  selector: 'app-autre',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './autre.component.html',
  styleUrl: './autre.component.css'
})
export class AutreComponent implements OnInit {
  autreForm!:FormGroup;
  selectedFile!: File;
  profile:any;

  constructor(
    private fb:FormBuilder,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar) {}

    ngOnInit(): void {
      this.formateurService.profile().subscribe(
        prof => {
          this.profile = prof;
          this.initializeForm();
        },
        error => {
          console.error('Error fetching profile:', error);
          this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );
    }
    
    private initializeForm(): void {
      this.autreForm = this.fb.group({
        // cv: [this.profile.cv || ''],
        portfolio: [this.profile.portfolio || ''],
        linkedin: [this.profile.linkedin || ''],
      });
    }
    
      
    onFileSelected(event: any) {
      this.selectedFile = event.target.files[0];
      this.onUpload()
    }
  
    onUpload() {
      if (this.selectedFile) {
        console.log('hi  ',this.selectedFile)
        this.formateurService.uploadCV(this.selectedFile)
          .subscribe(
            (response) => {
              console.log(response);
              alert('CV uploaded successfully.');
            },
            (error) => {
              console.error(error);
              alert('Failed to upload CV.');
            }
          );
      } else {
        alert('Please select a file to upload.');
      }
    }

  //   onFileSelected(event: any): void {
  //     this.selectedFile = event.target.files[0];
  //     this.onSubmit();
  //     // location.reload();
  
  //   }
  //   onSubmit(): void {
  //     if(this.selectedFile){
  //       this.formateurService.uploadCV(this.selectedFile).subscribe(
  //         response => console.log(response),
  //         error => console.error(error)
  //       );
  //   }
  //   else {
  //     console.log('Please select a file first.');
  //   }
  // }
  
    addprofile():void{
      
      if(this.autreForm.valid){
        this.formateurService.autre(this.autreForm.value).subscribe((res)=>{
          if(res.id != null){
            alert('modifie avec succes!');
            
            // this.router.navigateByUrl('formateur/home');
            setTimeout(() => {
              location.reload();
            }, 3000);
          }
          else{
            this.snackBar.open('Erreur!','close',{duration:5000,panelClass:'error-snackbar'});
          }
        })
      }else{
        alert('Veuillez remplir tous les champs obligatoires.');
  
      }
    }

}
