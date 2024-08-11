import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { FormateurService } from '../../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import {MatListModule} from '@angular/material/list';
import { DemandeComponent } from '../../demande/demande.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,NgbAlertModule,CommonModule,MatListModule, RouterModule,],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  demande:any;
  sessions:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar,
    public dialogRef: MatDialogRef<DemandeComponent>) {}

  ngOnInit(): void {

    this.formateurService.demande(this.data.id).subscribe(
      prof => {
        this.demande = prof;
        console.log('profile:', this.demande);
      },
      error => {
        console.error('Error fetching detail:', error);
        this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );

    this.formateurService.sessions(this.data.id).subscribe(
      prof => {
        this.sessions = prof;
        console.log('sessions:', this.sessions);
      },
      error => {
        console.error('Error fetching detail:', error);
        this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
   
  }
memoire(id:number){
  this.router.navigate([`/formateur/vacation/${id}`],{queryParams: { key: id }} );
  this.dialogRef.close();

}
session():void{
  this.dialogRef.close();
}
}
