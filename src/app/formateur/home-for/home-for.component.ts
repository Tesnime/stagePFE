import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navs/navbar/navbar.component';
import { NavComponent } from '../navs/nav/nav.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { FormateurService } from '../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SessionDetailsComponent } from '../modal/session-details/session-details.component';
import { CommonModule } from '@angular/common';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { UserStorageService } from '../../Services/storage/user-storage.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { SessionComponent } from '../session/session.component';
import { ChatComponent } from '../../chat/chat/chat.component';
import { DemandeComponent } from '../demande/demande.component';
import { SessionsComponent } from '../sessions/sessions.component';
import { AuthService } from '../../Services/auth.service';
import { AgendaComponent } from '../agenda/agenda.component';
import { StatComponent } from '../modal/stat/stat.component';
// import { MatListModule } from '@angular/material/list';


// export interface Tile {
//   color: string;
//   cols: number;
//   rows: number;
//   text: string;
// }
@Component({
  selector: 'app-home-for',
  standalone: true,
  imports: [MatButtonModule,CommonModule,NgbNavModule,NgbDropdownModule,
    // MatNativeDateModule,
    // ReactiveFormsModule,
    NgbDatepickerModule,
    // MatFormFieldModule,
    MatInputModule,MatListModule, MatDividerModule,
    DemandeComponent,SessionsComponent,ChatComponent,AgendaComponent,StatComponent,AgendaComponent],
  templateUrl: './home-for.component.html',
  styleUrl: './home-for.component.css'
})
export class HomeForComponent {
  active = 'accueil';
  sessions:any;
  formateur:any;
  isExpired:any;
  imageUrl!: SafeUrl;
  

  constructor(private fb: FormBuilder,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private authService:AuthService,
    private sanitizer: DomSanitizer) {}

    calendar = inject(NgbCalendar);

    hoveredDate: NgbDate | null = null;
    fromDate: NgbDate = this.calendar.getToday();
    toDate: NgbDate | null= this.calendar.getNext(this.fromDate, 'd', 5);

    ngOnInit(): void {
      const savedActiveTab = localStorage.getItem('activeTab');
      if (savedActiveTab) {
        this.active = savedActiveTab;
      } else {
        this.active = 'accueil'; 
      }
  
      this.token();

      this.formateurService.getImage().subscribe(
        response => this.createImageFromBlob(response),
        error => console.error(error)
      );

      this.formateurService.sessionByFormateur().subscribe(
        prof => {
          this.sessions = prof;
          this.sessions.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          this.filterSessionsForCurrentWeek(); 
          // console.log('sessions:', this.sessions);
        },
        error => {
          console.error('Error fetching detail:', error);
          this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );
      this.formateurService.profile().subscribe(
        prof => {
          this.formateur = prof;
          // this.sessions.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          // this.filterSessionsForCurrentWeek(); 
          // console.log('sessions:', this.sessions);
        },
        error => {
          console.error('Error fetching detail:', error);
          this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
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
    token(){
      this.authService.isExpired().subscribe(
        expired => {
          this.isExpired = expired;
          // console.log('isExpired: ', this.isExpired);
          if (this.isExpired) {
          this.snackBar.open('Votre session a expiré, veuillez vous reconnecter.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
          UserStorageService.SignOut(); 
          localStorage.setItem('activeTab', 'accueil');
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

    onTabChange(event: string): void {
      this.active = event;
      localStorage.setItem('activeTab', event);
    }
    
    logout(){
      UserStorageService.SignOut();
      localStorage.setItem('activeTab', 'accueil');
      this.router.navigateByUrl('');
    }
    
    openDialog(id:number) {
      const dialogRef = this.dialog.open(SessionDetailsComponent,{
        width:'65%',
        height:'85%',
        data: { id: id} 
      });
    }
    filterSessionsForCurrentWeek(): void {
      const currentDate = new Date();
      const currentDayOfWeek = currentDate.getDay(); // Récupérer le jour de la semaine (0 = dimanche, 1 = lundi, ..., 6 = samedi)
      const daysUntilEndOfWeek = 6 - currentDayOfWeek; // Nombre de jours restants dans la semaine
    
      const currentWeekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDayOfWeek); // Début de la semaine actuelle
      const currentWeekEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + daysUntilEndOfWeek); // Fin de la semaine actuelle
    
      this.sessions = this.sessions.filter((session: any) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= currentDate && sessionDate <= currentWeekEnd;
      });
    }

    
	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
			this.toDate = date;
		} 
    else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate): boolean {
    const today = new Date();
    const startOfWeek = this.getStartOfWeek(today);
    const endOfWeek = this.getEndOfWeek(today);
  
    return (
      this.isDateInRange(date, startOfWeek, endOfWeek)
    );
  }
  
  private getStartOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay() || 7; // Get day of the week (1 = Monday, 7 = Sunday)
    if (day !== 1) { // If not Monday
      start.setHours(-24 * (day - 1)); // Move to previous Monday
    }
    start.setHours(0, 0, 0, 0); // Start of the day
    return start;
  }
  
  private getEndOfWeek(date: Date): Date {
    const end = new Date(date);
    const day = end.getDay() || 7; // Get day of the week (1 = Monday, 7 = Sunday)
    if (day !== 7) { // If not Sunday
      end.setHours(24 * (7 - day)); // Move to next Sunday
    }
    end.setHours(23, 59, 59, 999); // End of the day
    return end;
  }
  
  private isDateInRange(date: NgbDate, startDate: Date, endDate: Date): boolean {
    const dateToCheck = new Date(date.year, date.month - 1, date.day);
    return dateToCheck >= startDate && dateToCheck <= endDate;
  }
  formatDate(date: NgbDate): string {
    return `${date.day.toString().padStart(2, '0')}/${date.month.toString().padStart(2, '0')}/${date.year}`;
  }
  isInRange(itemDate: string): boolean {
    const item = new Date(itemDate);
    const from = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
    const to = this.toDate ? new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day) : null;
    return item >= from && (!to || item <= to);
  }
    
}
