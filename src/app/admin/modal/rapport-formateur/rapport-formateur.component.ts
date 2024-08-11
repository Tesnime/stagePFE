import { AdminService } from './../../../Services/admin.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Chart, ChartModule } from 'angular-highcharts';
import { br } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-rapport-formateur',
  standalone: true,
  imports: [ChartModule,CommonModule],
  templateUrl: './rapport-formateur.component.html',
  styleUrl: './rapport-formateur.component.css'
})
export class RapportFormateurComponent {
  formateur:any;
  session:any;
  sessions:any;
  demande:any;
  theme: any = {};
  perc: any = {};
  themeChart!:Chart;
  percentageChart!:Chart;
  sum:any=0;
  apprenants=0;
  taux:any;
  tauxPresence!:Chart;
  MoyStar!:Chart;
  evalChart!:Chart;
  chartData:any[]=[];

  constructor(private route: ActivatedRoute,
    private adminService:AdminService,
    private snackBar:MatSnackBar,
  ) {}

ngOnInit() {
 

  this.route.queryParams.subscribe(params => {
      if (params['formateur']) {
        this.formateur = JSON.parse(params['formateur']);
      }
    });
  
  this.adminService.firstSession(this.formateur.id).subscribe(
    sess => {
      this.session = sess;
      console.log(this.session)
    },
    error => {
      console.error('Error fetching detail:', error);
      this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
    }
  );

  this.adminService.getTaux(this.formateur.id).subscribe(
    sess => {
      this.taux = Math.round(sess);
      this.tauxPresence= new Chart({
        chart:{
          type: 'pie',
          plotShadow: false,
        },
        credits:{
          enabled:false
        },
        plotOptions:{
          pie:{
            innerSize: '85%',
            borderWidth: 70,
            borderColor: 'transparent',
            slicedOffset: 20,
            dataLabels:{
              connectorWidth: 1
            }
          }
        },
        title:{
          verticalAlign:'middle',
          floating: true,
          text: " Taux de presence "
        },
        legend: {
          enabled: false,
        },
        series:[
         { 
          type:'pie',
          data:[
            {name: ' presence', y: this.taux},
            {name: ' absense', y: 100-this.taux},
          ]
        }
        ]
      })
    },
    error => {
      console.error('Error fetching detail:', error);
      this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
    }
  );

  this.adminService.getTauxStar(this.formateur.id).subscribe(
    sess => {
      let text=`Total des étoiles pour <br> toutes les formations <br> ${sess}/5`
      this.MoyStar= new Chart({
        chart:{
          type: 'pie',
          plotShadow: false,
        },
        credits:{
          enabled:false
        },
        plotOptions:{
          pie:{
            innerSize: '90%',
            borderWidth: 70,
            borderColor: 'transparent',
            slicedOffset: 10,
            dataLabels:{
              connectorWidth: 0
            }
          }
        },
        title:{
          verticalAlign:'middle',
          floating: true,
          text: text
        },
        legend: {
          enabled: false,
        },
        series:[
         { 
          type:'pie',
          data:[
            {name:'',y: sess,color:"#334EAC"},
            {name:'',y: 5-sess, color:'transparent'},
          ]
        }
        ]
      })
    },
    error => {
      console.error('Error fetching detail:', error);
      this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
    }
  );
   
  this.adminService.getEval(this.formateur.id).subscribe(
    sess => {
      const getDataOrDefault = (question: string, response: string) => sess[question] && sess[question][response] !== undefined ? sess[question][response] : 0;

      this.chartData = [
        {
          type: 'column',
          name: 'très bien',
          data: [
            getDataOrDefault('q1', 'très bien'),
            getDataOrDefault('q2', 'très bien'),
            getDataOrDefault('q3', 'très bien'),
            getDataOrDefault('q4', 'très bien'),
            getDataOrDefault('q5', 'très bien')
          ]
        } as any,
        {
          type: 'column',
          name: 'bien',
          data: [
            getDataOrDefault('q1', 'bien'),
            getDataOrDefault('q2', 'bien'),
            getDataOrDefault('q3', 'bien'),
            getDataOrDefault('q4', 'bien'),
            getDataOrDefault('q5', 'bien')
          ]
        },
        {
          type: 'column',
          name: 'passable',
          data: [
            getDataOrDefault('q1', 'passable'),
            getDataOrDefault('q2', 'passable'),
            getDataOrDefault('q3', 'passable'),
            getDataOrDefault('q4', 'passable'),
            getDataOrDefault('q5', 'passable')
          ]
        },
        {
          type: 'column',
          name: 'insuffisant',
          data: [
            getDataOrDefault('q1', 'insuffisant'),
            getDataOrDefault('q2', 'insuffisant'),
            getDataOrDefault('q3', 'insuffisant'),
            getDataOrDefault('q4', 'insuffisant'),
            getDataOrDefault('q5', 'insuffisant')
          ]
        },
        {
          type: 'column',
          name: 'oui',
          data: [
            '', '', '', '', '',
            getDataOrDefault('q6', 'oui')
          ]
        },
        {
          type: 'column',
          name: 'non',
          data: [
            '', '', '', '', '',
            getDataOrDefault('q6', 'non')
          ]
        }
      ];
      this.evalChart = new Chart({
        chart: {
          type: 'column'
        },
        title: {
          text: "Résumé des evaluations reçus"
        },
        xAxis: {
          categories: [
            'Programme respecté et objectifs atteints',
            "Connaissances applicables au travail",
            'Compétences techniques de l’animateur',
            'Satisfaction des supports pédagogiques',
            'Conditions de déroulement de la formation',
            'Intention de poursuivre après la formation.'
          ]
        },
        credits:{
          enabled: false
        },
        series: this.chartData
      });
      
    },
    error => {
      console.error('Error fetching detail:', error);
      this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
    }
  );

  // this.evalChart = new Chart({
  //   chart: {
  //     type: 'column'
  //   },
  //   title: {
  //     text: "Evaluation"
  //   },
  //   xAxis: {
  //     categories: [
  //       'Programme respecté et objectifs atteints',
  //       "Connaissances applicables au travail",
  //       'Compétences techniques de l’animateur',
  //       'Satisfaction des supports pédagogiques',
  //       'Conditions de déroulement de la formation',
  //       'Intention de poursuivre après la formation.'
  //     ]
  //   },
  //   credits:{
  //     enabled: false
  //   },
  //   series: this.chartData
  // });

 
  this.adminService.getDemandesByFormateurId(this.formateur.id)
      .subscribe(demandes => {this.demande = demandes;
      this.demande.forEach((element:any) => {
          this.sum+=element.nbJours;
          this.apprenants+=element.demande.apprenants.length;
        });
    }
  );
  
  this.adminService.getthemePercentage(this.formateur.id)
  .subscribe(demandes => {
    if (demandes && typeof demandes === 'object') {
      this.theme = demandes;

      // Prepare the data for the pie chart
      const chartData = Object.keys(this.theme).map(key => ({
        name: key,      
        y: this.theme[key], 
        // color: '#44435F'
      }));

      // Create the chart
      this.themeChart = new Chart({
        chart: { type: 'pie' },
        title: {
          text: 'Pourcentage des Thèmes Abordés par le Formateur'
        },
        series: [
          {
            type: 'pie',
            data: chartData // Use the prepared chartData here
          }
        ]
      });
    } else {
      console.error('Invalid data format: Expected an object', demandes);
    }
  },
  error => {
    console.error('Error fetching data', error);
  });

  this.adminService.getPercentage(this.formateur.id)
  .subscribe(demandes => {
    if (demandes && typeof demandes === 'object') {
      this.perc = demandes;

      // Prepare the data for the pie chart
      const chartData = Object.keys(this.perc).map(key => ({
        name: key,      
        y: this.perc[key], 
        // color: '#44435F'
      }));

      // Create the chart
      this.percentageChart = new Chart({
        chart: { type: 'pie' },
        title: {
          text: 'Statistiques des Demandes Acceptées et Refusées'
        },
        series: [
          {
            type: 'pie',
            data: chartData // Use the prepared chartData here
          }
        ]
      });
    } else {
      console.error('Invalid data format: Expected an object', demandes);
    }
  },
  error => {
    console.error('Error fetching data', error);
  });

  }
}


