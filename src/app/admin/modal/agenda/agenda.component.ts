import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import daygridPlugin from '@fullcalendar/daygrid';
import localeFr from '@angular/common/locales/fr';
import { AdminService } from '../../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddSessionComponent } from '../add-session/add-session.component';


@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [FullCalendarModule,CommonModule],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent {
  @Input() agendaData: any;
  @Output() sessionAdded = new EventEmitter<any>();
  sessions: any[] = [];
  calendarOptions: any = {
    plugins: [daygridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    events: [],
    dateClick: this.handleDateClick.bind(this),
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
  

  handleDateClick(arg: any): void {
    this.openDialog(arg.date);
  }

  openDialog(date: any): void {
    const dialogRef = this.dialog.open(AddSessionComponent, {
      width: '60%',
      height: '75vh',
      data: { date: date, id: this.agendaData }
    });

    dialogRef.componentInstance.sessionAdded.subscribe((session: any) => {
      this.sessions.push(session);
      this.updateCalendarEvents();
      this.sessionAdded.emit(session); // Emit the added session to the parent component
    });
  }
}
