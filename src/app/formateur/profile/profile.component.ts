import { EditFormComponent } from './../modal/edit-form/edit-form.component';
import { Component, OnInit, TemplateRef, ViewEncapsulation, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { FormateurService } from '../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navs/navbar/navbar.component';
import { InfoPerComponent } from '../modal/info-per/info-per.component';
import { FormationComponent } from '../modal/formation/formation.component';
import { ExperienceComponent } from '../modal/experience/experience.component';
import { AutreComponent } from '../modal/autre/autre.component';
import { MatDialog } from '@angular/material/dialog';
import { EditExprComponent } from '../modal/edit-expr/edit-expr.component';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent,InfoPerComponent,FormationComponent,
    ExperienceComponent,AutreComponent,CommonModule],
  templateUrl: './profile.component.html',
  encapsulation:ViewEncapsulation.None,
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  selectedFile!: File;
  imageUrl!: SafeUrl;
  profile:any;
  formation:any;
  experience:any;
  constructor(private router: Router,
    private fb:FormBuilder,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer) {}

  ngOnInit(): void {

    this.formateurService.getImage().subscribe(
      response => this.createImageFromBlob(response),
      error => console.error(error)
    );

    this.formateurService.profile().subscribe(
      prof => {
        this.profile = prof;
        console.log('profile:', this.profile);
      },
      error => {
        console.error('Error fetching profile:', error);
        this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );

    this.formateurService.formations().subscribe(
      prof => {
        this.formation = prof;
        console.log('formation:', this.formation);
      },
      error => {
        console.error('Error fetching profile:', error);
        this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );

    this.formateurService.exprs().subscribe(
      prof => {
        this.experience = prof;
        console.log('experiences:', this.experience);
      },
      error => {
        console.error('Error fetching profile:', error);
        this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
  }
  createImageFromBlob(image: Blob): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.onSubmit();
    location.reload();

  }
  onSubmit(): void {
    if(this.selectedFile){
      this.formateurService.uploadImage(this.selectedFile).subscribe(
        response => console.log(response),
        error => console.error(error)
      );
  }
  else {
    console.log('Please select a file first.');
  }
}
  openDialog() {
    const dialogRef = this.dialog.open(InfoPerComponent
      ,{
      width:'50%',
      height:'85%'
    }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  } 
  openDialog1() {
    const dialogRef = this.dialog.open(FormationComponent
      ,{
      width:'50%',
      height:'85%'
    }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  } 
  openDialog2() {
    const dialogRef = this.dialog.open(ExperienceComponent
      ,{
      width:'50%',
      height:'85%'
    }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  } 
  openDialog3() {
    const dialogRef = this.dialog.open(AutreComponent
      ,{
      width:'50%',
      height:'85%'
    }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  } 

  editForm(id:number){
    const dialogRef = this.dialog.open(EditFormComponent
      ,{
      width:'50%',
      height:'85%',
      data:id
    }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
 
  editExpr(id:number){
    const dialogRef = this.dialog.open(EditExprComponent
      ,{
      width:'50%',
      height:'85%',
      data:id
    }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deleteForm(id:number){
    this.formateurService.deleteFormation(id).subscribe(
      data =>{
        console.log('delete response',data);
        this.snackBar.open('supprimer avec succes.', 'Close', { duration: 5000 });
        setTimeout(() => {
          location.reload();
        }, 3000);
      }
    )
  }
  deleteExpr(id:number){
    this.formateurService.deleteExpr(id).subscribe(
      data =>{
        console.log('delete response',data);
         this.snackBar.open('supprimer avec succes.', 'Close', { duration: 5000 });
         setTimeout(() => {
          location.reload();
        }, 3000);
      }
    )
  }

  
  openCvInNewTab(): void {
    this.formateurService.getCV().subscribe(
      (blob: Blob) => {
        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);
        
        // Open the Blob URL in a new tab
        window.open(url, '_blank');
        
        // Clean up the Blob URL
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Failed to load CV:', error);
        alert('Failed to load CV.');
      }
    );
  }
  
}
