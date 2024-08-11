import { Component } from '@angular/core';
import { NavbarComponent } from '../navs/navbar/navbar.component';
import { NavComponent } from '../navs/nav/nav.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormateurService } from '../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SessionDetailsComponent } from '../modal/session-details/session-details.component';
import { DemandeComponent } from '../demande/demande.component';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [NavbarComponent,NavComponent,CommonModule,MatDialogModule],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})
export class SessionComponent {
  sessions:any;
  receivedData:any;
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,) {}

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      this.receivedData = params['key'];
      // Use receivedData as needed
      console.log(this.receivedData);
    });

    this.formateurService.sessions(this.receivedData).subscribe(
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

  openDialog(id:number) {
    const dialogRef = this.dialog.open(SessionDetailsComponent,{
      width:'50%',
      height:'85%',
      data: { id: id} 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  
}
