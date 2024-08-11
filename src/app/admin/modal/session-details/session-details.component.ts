import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModifSessionComponent } from '../modif-session/modif-session.component';
import { FormateurService } from '../../../Services/formateur.service';
import {Chart, ChartModule} from 'angular-highcharts';
import { ApprenantDetailsComponent } from '../apprenant-details/apprenant-details.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-session-details',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,NgbAlertModule,CommonModule,MatListModule, RouterModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule, NgbNavModule,
    MatStepperModule,FormsModule,ReactiveFormsModule
    ],
  templateUrl: './session-details.component.html',
  styleUrl: './session-details.component.css'
})
export class SessionDetailsComponent {
  active = 'top';
  session:any;
  comments:any;
  presence:any;
  isPresent:any;


  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder,
    private router: Router,
    private adminService:AdminService,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,
    ) {}

  ngOnInit(): void {
    this.adminService.session(this.data.id).subscribe(
      prof => {
        this.session= prof;
        console.log('formateur id: ', prof.demande.formateur.id);
        
        this.adminService.getFormateurPresenc(prof.demande.formateur.id,prof.id).subscribe(
          prof => {
            this.presence = prof[0];
            console.log('presence: ', this.presence);
          },
          error => {
            console.error('Error fetching demandes:', error);
            this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
          }
        );
      },
      error => {
        console.error('Error fetching demandes:', error);
        this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );

   

    this.adminService.getComment(this.data.id).subscribe(
      prof => {
        this.comments = prof;
        console.log('comments admin:', this.comments);
      },
      error => {
        console.error('Error fetching detail:', error);
        this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
}

modifier(){
  const dialogRef = this.dialog.open(ModifSessionComponent,{
    width:'55%',
    height:'65%',
    data: { session: this.session} 
  });
}
openApprenant(app : any){
  const dialogRef = this.dialog.open(ApprenantDetailsComponent,{
    width:'45%',
    height:'60%',
    data: { apprenant:app,session: this.session} 
  });
}
isFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for an accurate comparison

  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for an accurate comparison

  return inputDate > today;
}
}