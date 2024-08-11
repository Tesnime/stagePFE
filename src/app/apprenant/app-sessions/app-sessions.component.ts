import { Component } from '@angular/core';
import { UserStorageService } from '../../Services/storage/user-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApprenantService } from '../../Services/apprenant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../Services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SessionTerminerComponent } from '../modal/session-terminer/session-terminer.component';


@Component({
  selector: 'app-app-sessions',
  standalone: true,
  imports: [MatButtonModule,CommonModule],
  templateUrl: './app-sessions.component.html',
  styleUrl: './app-sessions.component.css'
})
export class AppSessionsComponent {
  isExpired:any;
  demandes:any;

  constructor(
    private apprenantService:ApprenantService,
    private snackBar:MatSnackBar,
    private authService:AuthService,
    private router: Router,
    public dialog: MatDialog,
    ) {}

    ngOnInit(): void {
      this.token();

      this.apprenantService.demandeByApp().subscribe(
        prof => {
          this.demandes = prof;
        },
        error => {
          console.error('Error fetching profile:', error);
          this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );
    }


  logout(){
    UserStorageService.SignOut();
    this.router.navigateByUrl('');
  }
  token(){
    this.authService.isExpired().subscribe(
      expired => {
        this.isExpired = expired;
        console.log('isExpired: ', this.isExpired);
        if (this.isExpired) {
        this.snackBar.open('Votre session a expiré, veuillez vous reconnecter.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        UserStorageService.SignOut();  
        this.router.navigateByUrl('/');
          
        }
      },
      error => {
        console.error('Error fetching demandes:', error);
        this.snackBar.open('Votre session a expiré, veuillez vous reconnecter.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        // this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        UserStorageService.SignOut();
        this.router.navigateByUrl('/');
  
      }
    );
  
  }
  openDetails(demande:any) {
    const dialogRef = this.dialog.open(SessionTerminerComponent,{
      width:'70%',
      height:'85%',
      data: { demande : demande} 
    });
  }
}
