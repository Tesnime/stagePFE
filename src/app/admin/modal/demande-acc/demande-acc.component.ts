import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdminService } from '../../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SessionDetailsComponent } from '../session-details/session-details.component';
import { AgendaComponent } from '../agenda/agenda.component';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-demande-acc',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,CommonModule,AgendaComponent,
    MatIconModule,],
  templateUrl: './demande-acc.component.html',
  styleUrl: './demande-acc.component.css'
})
export class DemandeAccComponent {
  demande = this.data.demande;
  session: any[] = [];
  ajout: boolean = false;
  responseMessage: string | null = null;
  @ViewChild('vacationContent', { static: false }) vacationContent!: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.demande);
    this.adminService.sessionsBydemande(this.demande.id).subscribe(
      prof => {
        this.session = prof;
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

  openSession(ite: any) {
    const dialogRef = this.dialog.open(SessionDetailsComponent, {
      width: '65%',
      height: '85%',
      data: { id: ite.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ajouter() {
    this.ajout = true;
  }

  onSessionAdded(session: any) {
    this.session.push(session);
    this.ajout = false;
  }

  viewCertif(id: number): void {
    this.adminService.Certificate(id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (error) => {
        this.responseMessage = `Failed to fetch certificate content: ${error.message}`;
      }
    });
  }

  lower(a: string) {
    return a.toLowerCase();
  }

  viewVacation(): void {
    this.router.navigate(['admin/vacation'], { state: { demande: this.demande } });
  }

  viewPresence():void{
    this.router.navigate(['admin/presence'], { state: { demande: this.demande } });

  }

  viewCommodites():void{
    this.router.navigate(['admin/commodites'], { state: { demande: this.demande } });

  }
  viewRapport(): void {
    // console.log("envoyer "+JSON.stringify(demande))
    this.router.navigate(['admin/rapport'], { queryParams: { demande: JSON.stringify(this.demande) } });
  }
}
