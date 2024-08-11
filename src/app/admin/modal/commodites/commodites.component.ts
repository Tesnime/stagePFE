import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-commodites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commodites.component.html',
  styleUrl: './commodites.component.css'
})
export class CommoditesComponent {
  demande: any;
  sessions: any[] = [];
  @ViewChild('presenceContent', { static: false }) presenceContent!: ElementRef;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.demande = navigation?.extras.state?.['demande'];
  }

  ngOnInit(): void {
    if (this.demande && this.demande.id) {
      this.fetchSessions();
    } else {
      console.error('No demande found in navigation state.');
      this.snackBar.open('No demande found in navigation state. Please try again.', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
    }
  }

  fetchSessions(): void {
    this.adminService.sessionsBydemande(this.demande.id).subscribe(
      prof => {
        this.sessions = prof;
        setTimeout(() => this.generatePDF(), 500); 
      },
      error => {
        console.error('Error fetching detail:', error);
        this.snackBar.open('Error fetching details. Please try again.', 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    );
  }

  isApprenantPresent(session: any, apprenantId: any): boolean {
    return session.presences && session.presences.some((presence: any) => presence.apprenant && presence.apprenant.id === apprenantId);
  }

  getFirstSessionPresence(apprenantId: number, type: 'manuel' | 'cartable'): boolean | null {
    const firstSession = this.sessions[0];
    if (firstSession) {
      const presence = firstSession.presences.find((p: any) => p.apprenant && p.apprenant.id === apprenantId);
      if (presence) {
        return presence[type] ?? null;
      }
    }
    return null;
  }

  getPresenceStatus(apprenantId: number, type: 'pauseCafe' | 'dejeuner'): boolean {
    return this.sessions.some(session => {
      const presence = session.presences.find((p: any) => p.apprenant?.id === apprenantId);
      return presence ? presence[type] : false;
    });
  }

  generatePDF(): void {
    if (!this.presenceContent) {
      console.error('Vacation content is not yet available');
      this.snackBar.open('Vacation content is not yet available. Please try again later.', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
      return;
    }

    const vacationContent = this.presenceContent.nativeElement;

    html2canvas(vacationContent, { useCORS: true }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const pdfURL = pdf.output('bloburl');
      window.open(pdfURL, '_blank');
    }).catch(error => {
      console.error('Error generating PDF:', error);
      this.snackBar.open('Error generating PDF. Please try again.', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
    });
  }
}


