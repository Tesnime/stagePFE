import interactionPlugin from '@fullcalendar/interaction';
import daygridPlugin from '@fullcalendar/daygrid';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AdminService } from '../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AgendaDetailsComponent } from '../../formateur/modal/agenda-details/agenda-details.component';
import { SessionDetailsComponent } from '../modal/session-details/session-details.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule,CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  @Input() agendaData: any;
  @Output() sessionAdded = new EventEmitter<any>();
  sessions: any[] = [];
  calendarOptions: any = {
    plugins: [daygridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    events: [],
    eventClick: this.handleEventClick.bind(this),
    locale: 'fr',
  };

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.adminService.sessions().subscribe(
      sessions => {
        this.sessions = sessions;
        console.log('sessions:', this.sessions);
        this.updateCalendarEvents();
      },
      error => {
        console.error('Error fetching sessions:', error);
        this.snackBar.open('Error fetching sessions. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
  }

  updateCalendarEvents(): void {
    const events = this.sessions.map(session => ({
      title: session.demande.status === 'proposer' 
        ? session.demande.title 
        : `${session.demande.formateur.firstname} ${session.demande.formateur.lastname}`,
      start: session.date,
      extendedProps: { session }
    }));
    this.calendarOptions.events = events;
  }
  
  handleEventClick(clickInfo: any): void {
    const session = clickInfo.event.extendedProps.session;
    const date = clickInfo.event.start;
    
   
    this.openDialog(session,date);
  }
  openDialog(session: any,date:Date): void {
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
        const dialogRef = this.dialog.open(SessionDetailsComponent, {
          width:'70%',
          height:'90%',
          data: {id: session.id }
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
