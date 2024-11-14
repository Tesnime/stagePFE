import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route, Router } from '@angular/router';
import { UserStorageService } from '../../Services/storage/user-storage.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DemandesComponent } from '../demandes/demandes.component';
import { SessionsAdComponent } from '../sessions/sessionsAd.component';
import {MatBadgeModule} from '@angular/material/badge';
import { ChatComponent } from '../../chat/chat/chat.component';
import { AdminService } from '../../Services/admin.service';
import { RapportComponent } from '../rapport/rapport.component';
import { StatComponent } from '../modal/stat/stat.component';
import { AgendaComponent } from '../modal/agenda/agenda.component';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule,MatIconModule,NgbNavModule,DemandesComponent,SessionsAdComponent,
    MatBadgeModule,ChatComponent,RapportComponent,StatComponent,AgendaComponent],
  templateUrl: './home.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './home.component.css'
})
export class HomeComponent {
  active = 'top';
  isExpired:any;
  hidden = false;
  nbDemandes:any;
  session: any;
  demandes:any;

  

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  constructor(private adminService:AdminService,
    private authService:AuthService,
    private snackBar:MatSnackBar,
    private router: Router){
  }

  ngOnInit(): void {
    const savedActiveTab = localStorage.getItem('activeTab');
    if (savedActiveTab) {
      this.active = savedActiveTab;
    } else {
      this.active = 'top'; 
    }
  
    this.token();
    this.nbDemande();
    this.getDemandes();
   
    

  }   
  onTabChange(event: string): void {
    this.active = event;
    localStorage.setItem('activeTab', event);
  }
  nbDemande(){
    this.adminService.nbDemandes().subscribe(
      demande => {
        this.nbDemandes = demande;
        // console.log('demandes:', this.nbDemandes);
      },
      error => {
        console.error('Error fetching demandes:', error);
        this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    ); 
  }
  getDemandes(){
    this.adminService.demandesAccepter().subscribe(
      demandes => {
        this.demandes = demandes;
        for (const dem of this.demandes) {
          this.sessionByDemandeID(dem.id);
        }
      },
      error => {
        console.error('Error fetching demandes:', error);
        this.snackBar.open('Error fetching demandes. Please try again.', 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    );
  }
  
  token(){
    this.authService.isExpired().subscribe(
      expired => {
        this.isExpired = expired;
        console.log('isExpired: ', this.isExpired);
        if (this.isExpired) {
        this.snackBar.open('Votre session a expiré, veuillez vous reconnecter.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        UserStorageService.SignOut();  
        localStorage.setItem('activeTab', 'top');
        this.router.navigateByUrl('/login');
          
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
  agenda(){
    this.router.navigateByUrl('/admin/agenda');
  }
  logout():any{
    UserStorageService.SignOut();  
    localStorage.setItem('activeTab', 'top');
    this.router.navigateByUrl('/login');
  }
  sessionByDemandeID(id: any): void {
    this.adminService.sessionsBydemande(id).subscribe(
      sessions => {
        this.session = sessions;
        const test = this.compareDates(sessions);
        if (!test) {
          this.adminService.terminer(id).subscribe(res => {
            if (res.id !== null) {
              // this.snackBar.open('Envoyer avec succès!', 'close', { duration: 5000 });
            } else {
              this.snackBar.open('Erreur!', 'close', { duration: 5000, panelClass: 'error-snackbar' });
            }
          });
        }
      },
      error => {
        console.error('Error fetching demandes:', error);
        this.snackBar.open('Error fetching demandes. Please try again.', 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    );
  }

  compareDates(sessions: any[]): boolean {
    const currentDate = new Date();
    for (const session of sessions) {
      const sessionDate = new Date(session.date);
      if (sessionDate >= currentDate) {
        return true;
      }
    }
    return false;
  }
}
