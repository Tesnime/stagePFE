import { AgendaDetailsComponent } from './../modal/agenda-details/agenda-details.component';
import { Component, signal } from '@angular/core';
import { NavComponent } from '../navs/nav/nav.component';
import { NavbarComponent } from '../navs/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormateurService } from '../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
// import { SessionDetailsComponent } from '../modal/session-details/session-details.component';
import { AgendaComponent } from '../agenda/agenda.component';
import { SessionTerminerComponent } from '../modal/session-terminer/session-terminer.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { SessionDetailsComponent } from '../modal/session-details/session-details.component';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [NavbarComponent,NavComponent,CommonModule,AgendaComponent,MatExpansionModule,MatButtonModule
  ],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css'
})
export class SessionsComponent {
  sessions:any;
  i=0;
  readonly panelOpenState = signal(false);

  constructor(
    private formateurService:FormateurService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,) {}

    ngOnInit(): void {
  
      this.formateurService.sessionByFormateur().subscribe(
        prof => {
          this.sessions = prof;
          this.sessions.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          console.log('sessions:', this.sessions);
        },
        error => {
          console.error('Error fetching detail:', error);
          this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );
    }
  
    openDialog(session:any) {
      const dialogRef = this.dialog.open(AgendaDetailsComponent,{
        width:'30%',
        data: { session} 
      });
    }
  
    openDialog1(id:number) {
      const dialogRef = this.dialog.open(SessionTerminerComponent,{
        width:'65%',
        height:'85%',
        data: { id: id} 
      });
    }

    openSession(id:number) {
      const dialogRef = this.dialog.open(SessionDetailsComponent,{
        width:'65%',
        height:'85%',
        data: { id: id} 
      });
    }

    isFutureDate(date: Date): boolean {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
    
      // Get the provided date without the time part
      const providedDate = new Date(date);
      providedDate.setHours(0, 0, 0, 0);
    
      // Compare the dates
      return providedDate >= currentDate;
    }
    isToday(date: Date): boolean {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
    
      const providedDate = new Date(date);
      providedDate.setHours(0, 0, 0, 0);
    
      // Compare the time values of the two dates
      return providedDate.getTime() === currentDate.getTime();
    }
    
}
