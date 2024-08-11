import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import interactionPlugin from '@fullcalendar/interaction';
import daygridPlugin from '@fullcalendar/daygrid';
// import { CalendarOptions } from '@fullcalendar/angular'; 
import timeGridPlugin from '@fullcalendar/timegrid';


import localeFr from '@angular/common/locales/fr';
import { CommonModule } from '@angular/common';
import { AgendaDetailsComponent } from '../../formateur/modal/agenda-details/agenda-details.component';
import { FormateurService } from '../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApprenantModule } from '../apprenant.module';
import { ApprenantService } from '../../Services/apprenant.service';
import { SessionTerminerComponent } from '../modal/session-terminer/session-terminer.component';


@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [FullCalendarModule,CommonModule],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent {
  sessions:any[]=[];

  calendarOptions: any = {
    plugins: [daygridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: [],
    eventClick: this.handleEventClick.bind(this),
    locale: 'fr',
  };

  constructor(
    private apprenantService:ApprenantService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,) {}

    ngOnInit(): void {
  
      this.apprenantService.getSessions().subscribe(
        prof => {
          this.sessions = prof;
          // this.sessions.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          console.log('sessions:', this.sessions);
          this.updateCalendarEvents();
        },
        error => {
          console.error('Error fetching detail:', error);
          this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );
    }
    updateCalendarEvents(): void {
      const events = this.sessions.map(session => ({
        title: session.nom, 
        start: session.date, 
        extendedProps: { session }
      }));
      this.calendarOptions.events = events;
    }
    handleEventClick(clickInfo: any): void {
      const session = clickInfo.event.extendedProps.session;
      const date = clickInfo.event.start;
      
     
      this.openSessionModal(session,date);
    }
  
    openSessionModal(session: any,date:Date): void {
      if(this.isFutureDate(date)){
      const dialogRef = this.dialog.open(AgendaDetailsComponent, {
        width: '550px',
        height: '45vh',
        data: { session }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }else{
        const dialogRef = this.dialog.open(SessionTerminerComponent, {
          width:'70%',
          height:'90%',
          data: { session }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      }
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

}
