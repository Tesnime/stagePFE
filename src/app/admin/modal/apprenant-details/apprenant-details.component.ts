import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { Router } from 'express';
import { AdminService } from '../../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-apprenant-details',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,CommonModule,MatListModule],
  templateUrl: './apprenant-details.component.html',
  styleUrl: './apprenant-details.component.css'
})
export class ApprenantDetailsComponent {
  presence:any;
  sess:any={};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService:AdminService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,
    ) {}

    apprenants=this.data.apprenant;

    ngOnInit(): void {
      // console.log('apprenant id: '+  this.data.apprenant.id +" ---" +this.data.session.id);
      console.log('session: '+ JSON.stringify(this.data.session));

      this.adminService.getPresenceByApprenant(this.data.apprenant.id,this.data.session.id).subscribe(
        prof => {
          this.presence = prof[0];
          console.log('presence: ', this.presence);
        },
        error => {
          console.error('Error fetching demandes:', error);
          this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );

      this.adminService.firstAndLastSession(this.data.session.demande.id).subscribe(
        prof => {
          this.sess = prof;
          console.log('sess:', this.sess);
        },
        error => {
          console.error('Error fetching detail:', error);
          this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );
    }
    isFutureDate(date: Date): boolean {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for an accurate comparison
    
      const inputDate = new Date(date);
      inputDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for an accurate comparison
    
      return inputDate > today;
    }
}
