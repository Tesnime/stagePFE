import { Component } from '@angular/core';
import { AdminService } from '../../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Chart, ChartModule } from 'angular-highcharts';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { AgendaComponent } from '../agenda/agenda.component';
import { MatListModule } from '@angular/material/list';


@Component({
  selector: 'app-stat',
  standalone: true,
  imports: [ChartModule,AgendaComponent,MatListModule],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.css'
})
export class StatComponent {
  difficultes!:Chart;
  presenceSem!:Chart;
  themes!:Chart;
  

//   presenceSem = new Chart({
//     chart: {
//       polar: true,
//       type: 'pie'
//     },
//     title: {
//       text: 'Domaines d\'intérêt'
//     },
//     series: [
//       {
//         name: "Pourcentage",
//         data: [3,45,4]
//       } as any
//     ]
// });
  tot:any;
  taux:any;

  constructor(private adminService:AdminService,
    private snackBar:MatSnackBar,
   ){
  }

  ngOnInit(): void {
    this.adminService.diff().subscribe(
      t => {
        console.log(t)
       this.diffChart(t);
      },
      error => {
        console.error('Error fetching demandes:', error);
        this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
    this.adminService.getOverallPresenceRate().subscribe(
      t => {
        
       this.taux=Math.round(t) ;
      },
      error => {
        console.error('Error fetching demandes:', error);
        this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
    this.adminService.interet().subscribe(
      t => {
        console.log(t)
        this.interet(t);
      },
      error => {
        console.error('Error fetching demandes:', error);
        this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );

    this.adminService.DemandeTheme().subscribe(
      t => {
        console.log(t)
        this.DemandeTheme(t);
      },
      error => {
        console.error('Error fetching demandes:', error);
        this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
    
    this.a();
  }
  
    
a(){
  this.adminService.getTot().subscribe(
    t => {
      this.tot = t;
      console.log(t)
    },
    error => {
      console.error('Error fetching demandes:', error);
      this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
    }
  );
}

diffChart(diff: any[]) {
  const diffLabels = diff.map(item => item[0]); // Extracting labels from each item
  const diffValues = diff.map(item => item[1]); // Extracting values from each item

  const diffObservables = diffValues.map(value => of(value));

  forkJoin(diffObservables).pipe(
    catchError(error => {
      console.error('Error fetching difficulty data:', error);
      this.snackBar.open('Error fetching difficulty data. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      return [];
    })
  ).subscribe(
    (diffValues: any[]) => {
      this.difficultes = new Chart({
        chart: { type: 'column' },
        title: {
          text: 'Les difficultés rencontrées par les apprenants'
        },
        xAxis: {
          title: {
            text: 'Difficultés',
          },
          categories: diffLabels
        },
        yAxis: {
          title: {
            text: 'Nombre des apprenants qui ont rencontré cette difficulté',
          }
        },
        series: [
          {
            name: "Difficultés",
            data:diffValues.map((value, index) => ({
              y: value,
              color: this.getColumnColor(index) // Custom color for each column
            })),
            // color: '#374375',
          } as any
        ],
        // plotOptions: {
        //   series: {
        //     colorByPoint: true // Color each point individually
        //   }
        // }
      });
    }
  );
}
getColumnColor(index: number): string {
  // Add your custom colors here, if needed
  const colors = ['#3f51b5', '#ff9800', '#4caf50', '#f44336', '#9c27b0', '#2196f3'];
  return colors[index % colors.length];
}
interet(interestData: any[]){
  const interestLabels = interestData.map(item => item[0]);
const interestValues = interestData.map(item => item[1]);

const interestObservables = interestValues.map(value => of(value));

forkJoin(interestObservables).pipe(
  catchError(error => {
    console.error('Error fetching interest data:', error);
    this.snackBar.open('Error fetching interest data. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
    return [];
  })
).subscribe(
  (interestValues: any[]) => {
    const dataWithLabels = interestLabels.map((label, index) => ({
      name: label,
      y: interestValues[index]
    }));

    this.presenceSem = new Chart({
      chart: {
        polar: true,
        type: 'pie'
      },
      title: {
        text: 'Domaines d\'intérêt'
      },
      series: [
        {
          name: "Pourcentage",
          data: dataWithLabels
        } as any
      ],
      tooltip: {
        pointFormat: '<b>{point.name}: {point.y}</b>'
      }
    });
  }
);
}

DemandeTheme(demandeTheme: any) {
  const themes = Object.keys(demandeTheme).slice(0, 10);
  const themeValues = Object.values(demandeTheme).slice(0, 10);

  const dataWithLabels = themes.map((label, index) => ({
    name: label,
    y: themeValues[index]
  }));

  this.themes = new Chart({
    chart: {
      polar: true,
      type: 'pie'
    },
    // credits:{
    //   enabled:false
    // },
    // plotOptions:{
    //   pie:{
    //     innerSize: '75%',
    //     borderWidth: 200,
    //     borderColor: 'transparent',
    //     slicedOffset: 20,
    //     dataLabels:{
    //       connectorWidth: 1
    //     }
    //   }
    // },
    title: {
      text: 'Distribution des principaux sujets abordés lors des séances'
    },
    series: [
      {
        name: 'Pourcentage',
        data: dataWithLabels
      } as any
    ],
    tooltip: {
      pointFormat: '<b>{point.name}: {point.y}</b>'
    }
  });
}
}
