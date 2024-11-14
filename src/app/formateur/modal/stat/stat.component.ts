import { Component } from '@angular/core';
import { FormateurService } from '../../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Chart, ChartModule } from 'angular-highcharts';

@Component({
  selector: 'app-stat',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.css'
})

export class StatComponent {
  recommendations!:any[];




presenceSem = new Chart({
  chart: {
    polar: true,
    type: 'pie'
  },
  title: {
    text: ''
  },
  series: [
    {
      name: "Pourcentage",
      data: [3,45,4]
    } as any
  ]
});
presence = new Chart({
  chart: {
    polar: true,
    type: 'pie'
  },
  title: {
    text: ''
  },
  series: [
    {
      name: "Pourcentage",
      data: [3,45,4]
    } as any
  ]
});
  totale:any;
  appPerSession:any;
  constructor(
    
    private formateurService:FormateurService,
    private snackBar:MatSnackBar){}

    ngOnInit(): void {

      this.formateurService.total().subscribe(
        prof => {
          this.totale = prof;
        },
        error => {
          console.error('Error fetching profile:', error);
          this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );

      this.formateurService.recommendation().subscribe(
        prof => {
          this.recommendations = prof;
        },
        error => {
          console.error('Error fetching profile:', error);
          this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );

      this.formateurService.apprenatperSession().subscribe(
        prof => {
          this.appPerSession = prof;
        },
        error => {
          console.error('Error fetching profile:', error);
          this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );
    }
}
