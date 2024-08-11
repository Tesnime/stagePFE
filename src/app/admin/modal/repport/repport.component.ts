import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Chart, ChartModule } from 'angular-highcharts';
import { AdminService } from '../../../Services/admin.service';
import { CommonModule } from '@angular/common';
import { forkJoin, tap } from 'rxjs';

@Component({
  selector: 'app-repport',
  standalone: true,
  imports: [ChartModule,MatButtonModule,CommonModule],
  templateUrl: './repport.component.html',
  styleUrl: './repport.component.css'
})
export class RepportComponent {
  sessions:any;
  tresBien:any=0;
  bien:any=0;
  passable:any=0;
  insuffisant:any=0;
  present:number=0;
  presenceSem!:Chart;
  presence!:Chart;

  // presence=new Chart({
  //   title: {
  //     text: 'Pourcentage de présence'
  //   },
  //   series:[
  //     {
  //       type:'pie',
  //       data:[
  //         { name: 'Absence',y:1,color: '#44435F'},
  //         { name: 'Présence',y:2,color:'#7396D1'}
      
  //       ]
  //     }

  //   ]
  // });
 
  
  
  demande: any;
  stat:any;
  societesUniques: string[] = [];
  star:any;
  

  constructor(private route: ActivatedRoute,
    private adminService:AdminService,
    private snackBar:MatSnackBar,
  ) {}

ngOnInit() {
 

  this.route.queryParams.subscribe(params => {
      if (params['demande']) {
        this.demande = JSON.parse(params['demande']);
        // console.log(this.demande)
        this.societesUniques = this.getSocietesUniques(this.demande.apprenants);
      }
    });

    this.adminService.star(this.demande.id).subscribe(
      sess => {
        this.star = sess;
      },
      error => {
        console.error('Error fetching detail:', error);
        this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );


    this.adminService.sessionsBydemande(this.demande.id).subscribe(
      sessions => {
        this.sessions = sessions;
        this.lineChart(sessions);
    
        let sum = 0;
        const presenceObservables = sessions.map((session: any) =>
          this.adminService.nbPresence(session.id).pipe(
            tap(presenceCount => {
              sum += presenceCount;
            })
          )
        );
    
        forkJoin(presenceObservables).subscribe(
          () => {
            const totalApprenants = this.demande.apprenants.length;
            const totalSessions = sessions.length;
            const presencePercentage = (sum / (totalSessions * totalApprenants)) * 100;
            const absencePercentage = 100 - presencePercentage;
    
            this.presence = new Chart({
              chart: { type: 'pie' },
              title: {
                text: 'Pourcentage de présence'
              },
              series: [
                {
                  type: 'pie',
                  data: [
                    { name: 'Absence', y: absencePercentage, color: '#44435F' },
                    { name: 'Présence', y: presencePercentage, color: '#7396D1' }
                  ]
                }
              ]
            });
          },
          error => {
            console.error('Error fetching presence count:', error);
            this.snackBar.open('Error fetching presence count. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
          }
        );
      },
      error => {
        console.error('Error fetching demandes:', error);
        this.snackBar.open('Error fetching demandes. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );

    this.adminService.stat(this.demande.id).subscribe(
      prof => {
        this.stat = prof;
        console.log("stat: "+JSON.stringify(this.stat))
      },
      error => {
        console.error('Error fetching demandes:', error);
        this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
   
  
    // for( let item of this.demande.evaluationApprenants){
    //   if(item.q1 == 'très bien'){
    //     this.tresBien+=1
    //   }else if(item == 'bien'){
    //     this.bien+=1
    //   }else if(item == 'passable'){
    //     this.passable+=1
    //   }else if(item == 'insuffisant'){
    //     this.insuffisant+=1
    //   }
    // }

    // console.log("demande: "+this.demande)

  // this.route.queryParams.subscribe(params => {
  //   const demande = params['demande'];
  //   console.log('ID:', demande.id); // Exemple: affiche la propriété 'id' de l'objet demande
  //   console.log('Nom:', demande.nom);
  // });
}
// lineChart(sessions: any) {
//   const sessionLabels = Array.from({ length: sessions.length }, (_, i) => 's' + (i + 1));
//   const presenceCounts: number[] = [];

//   const presenceObservables = sessions.map((session: any) =>
//     this.adminService.nbPresence(session.id).pipe(
//       tap(presenceCount => presenceCounts.push(presenceCount*100/session.demande.apprenants.length))
//     )
//   );

//   forkJoin(presenceObservables).subscribe(
//     () => {
//       this.presenceSem = new Chart({
//         chart: { type: 'line' },
//         title: {
//           text: 'Pourcentage de présence par session'
//         },
//         xAxis: {
//           title: {
//             text: 'Sessions',
//           },
//           categories: sessionLabels
//         },
//         yAxis: {
//           title: {
//             text: 'Pourcentage',
//           }
//         },
//         series: [
//           {
//             name: "Pourcentage",
//             data: presenceCounts
//           } as any
//         ]
//       });
//     },
//     error => {
//       console.error('Error fetching presence counts:', error);
//       this.snackBar.open('Error fetching presence counts. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
//     }
//   );
  
// }
lineChart(sessions: any) {
  const sessionLabels = Array.from({ length: sessions.length }, (_, i) => 's' + (i + 1));
  const presenceCounts: number[] = [];
  const absenceCounts: number[] = [];

  const presenceObservables = sessions.map((session: any) =>
    this.adminService.nbPresence(session.id).pipe(
      tap(presenceCount => {
        const totalApprenants = session.demande.apprenants.length;
        const presencePercentage = (presenceCount / totalApprenants) * 100;
        presenceCounts.push(presencePercentage);
        absenceCounts.push(100 - presencePercentage);
      })
    )
  );

  forkJoin(presenceObservables).subscribe(
    () => {
      this.presenceSem = new Chart({
        chart: { type: 'line' },
        title: {
          text: 'Pourcentage de présence et d\'absence par session'
        },
        xAxis: {
          title: {
            text: 'Sessions',
          },
          categories: sessionLabels
        },
        yAxis: {
          title: {
            text: 'Pourcentage',
          },
          min: 0,
          max: 100
        },
        series: [
          {
            name: "Présence",
            data: presenceCounts,
            color: '#7396D1'
          } as any,
          {
            name: "Absence",
            data: absenceCounts,
            color: '#44435F'
          } as any
        ]
      });
    },
    error => {
      console.error('Error fetching presence counts:', error);
      this.snackBar.open('Error fetching presence counts. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
    }
  );
}

Object = Object;
private getSocietesUniques(apprenants: any[]): string[] {
  const societesSet = new Set<string>();
  apprenants.forEach(apprenant => {
    if (apprenant.societe) {
      societesSet.add(apprenant.societe);
    }
  });
  return Array.from(societesSet);
}
calculateTotal(question: string): number {
  let total = 0;
  if (this.stat && this.stat[question]) {
    const options = ['très bien', 'bien', 'passable', 'insuffisant','oui','non'];
    for (const option of options) {
      total += this.stat[question][option] || 0;
    }
  }
  return total;
}

percentage(question: string, option: string): number {
  return Math.round((this.stat[question][option] || 0) * 100 / this.demande.apprenants.length);
}
round(a:number){
  return Math.round(a);
}

}
