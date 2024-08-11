
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormateurService } from '../../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../Services/admin.service';
import * as moment from 'moment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';




@Component({
  selector: 'app-vacation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vacation.component.html',
  styleUrl: './vacation.component.css'
})
export class VacationComponent {
  demande: any;
  sessions: any[] = [];
  totalHours: string = '';
  @ViewChild('vacationContent', { static: false }) vacationContent!: ElementRef;

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
        this.totalHours = this.calculateTotalHours(this.sessions);
        console.log('Fetched sessions:', this.sessions); // Debug log
        // Ensure the data is rendered before generating the PDF
        setTimeout(() => this.generatePDF(), 500); // Add a delay if needed
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

  calculateTimeDifference(debut: string, fin: string): string {
    const [debutHours, debutMinutes] = debut.split(':').map(Number);
    const [finHours, finMinutes] = fin.split(':').map(Number);
    const debutDate = new Date(0, 0, 0, debutHours, debutMinutes);
    const finDate = new Date(0, 0, 0, finHours, finMinutes);
    const diffMilliseconds = finDate.getTime() - debutDate.getTime();
    const diffHours = Math.floor(diffMilliseconds / 1000 / 60 / 60);
    const diffMinutes = Math.floor((diffMilliseconds / 1000 / 60) % 60);

    return diffMinutes === 0 ? `${diffHours} h` : `${diffHours} h ${diffMinutes.toString().padStart(2, '0')} min`;
  }

  calculateTotalHours(sessions: any[]): string {
    let totalMilliseconds = 0;

    sessions.forEach(session => {
      const [debutHours, debutMinutes] = session.debut.split(':').map(Number);
      const [finHours, finMinutes] = session.fin.split(':').map(Number);
      const debutDate = new Date(0, 0, 0, debutHours, debutMinutes);
      const finDate = new Date(0, 0, 0, finHours, finMinutes);

      totalMilliseconds += finDate.getTime() - debutDate.getTime();
    });

    const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
    const totalMinutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

    return totalMinutes === 0 ? `${totalHours} h` : `${totalHours} h ${totalMinutes.toString().padStart(2, '0')} min`;
  }

  generatePDF(): void {
    if (!this.vacationContent) {
      console.error('Vacation content is not yet available');
      this.snackBar.open('Vacation content is not yet available. Please try again later.', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
      return;
    }

    const vacationContent = this.vacationContent.nativeElement;

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
