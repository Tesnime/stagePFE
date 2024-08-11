import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-feuille-de-presence',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feuille-de-presence.component.html',
  styleUrl: './feuille-de-presence.component.css'
})
export class FeuilleDePresenceComponent {
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
    console.log("demande   :" + this.demande);
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
      sessions => {
        this.sessions = sessions;
        console.log('Fetched sessions:', this.sessions);
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

  getUniqueEnterprises(): string[] {
    const enterprises = this.demande.apprenants.map((apprenant: any) => apprenant.societe);
    return Array.from(new Set(enterprises));
  }

  generatePDF(): void {
    if (!this.presenceContent) {
      console.error('Presence content is not yet available');
      this.snackBar.open('Presence content is not yet available. Please try again later.', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
      return;
    }

    const presenceContent = this.presenceContent.nativeElement;

    html2canvas(presenceContent, { useCORS: true }).then(canvas => {
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
