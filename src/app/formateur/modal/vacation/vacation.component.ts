
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormateurService } from '../../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';





@Component({
  selector: 'app-vacation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vacation.component.html',
  styleUrl: './vacation.component.css'
})
export class VacationComponent {
  demande:any;
  sessions:any;
  receivedData:any;
 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.receivedData = params['key'];
      // Use receivedData as needed
      console.log(this.receivedData);
    });
    this.formateurService.demande(this.receivedData).subscribe(
      prof => {
        this.demande = prof;
        console.log('profile:', this.demande);
      },
      error => {
        console.error('Error fetching detail:', error);
        this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );

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

    

     
    

}
