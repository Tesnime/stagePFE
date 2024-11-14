import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, NgZone, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ApprenantService } from '../../Services/apprenant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PostulerComponent } from '../modal/postuler/postuler.component';
import { AuthService } from '../../Services/auth.service';
import { UserStorageService } from '../../Services/storage/user-storage.service';
import { Route, Router, RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MonProfileComponent } from '../mon-profile/mon-profile.component';
import { AgendaComponent } from '../agenda/agenda.component';
import { MatCardModule } from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CommonModule, Time } from '@angular/common';
import { GoogleMapsModule } from "@angular/google-maps";
import { ChatComponent } from '../../chat/chat/chat.component';
import { SessionDetailsComponent } from '../modal/session-details/session-details.component';
import { ToDoComponent } from '../to-do/to-do.component';
import { AideComponent } from '../aide/aide.component';
import { Chart, ChartModule } from 'angular-highcharts';

@Component({
  selector: 'app-home-ap',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule,MatTabsModule,ChartModule, MonProfileComponent,AgendaComponent,MatCardModule, MatProgressBarModule,CommonModule, GoogleMapsModule,ChatComponent,ToDoComponent,AideComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './home-ap.component.html',
  styleUrl: './home-ap.component.css'
})
export class HomeApComponent {
  @ViewChild('mapContainer', { static: false }) gmap!: ElementRef;
  activeTab: number = 0;
  isExpired:any;
  session:any;
  display: any;
  map!: google.maps.Map;
  marker!: google.maps.Marker;
  themes!:Chart;

  companyPosition: google.maps.LatLngLiteral = {
    lat: 36.89363078046629,  
    lng: 10.186639174794436   
  };

  center: google.maps.LatLngLiteral = this.companyPosition;
    
  zoom = 18;

  markerOptions: google.maps.MarkerOptions = {
    draggable: false, 
    visible: true,
    label: 'A',
    opacity: 0.8,
    zIndex: 100
    // icon: this.markerIconUrl 
  };

  
  
    moveMap(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.center = (event.latLng.toJSON());
    }
  
    move(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.display = event.latLng.toJSON();
    }

  constructor(
    private apprenantService:ApprenantService,
    private snackBar:MatSnackBar,
    private authService:AuthService,
    private router: Router,
    public dialog: MatDialog,
    private ngZone: NgZone) {}


    ngAfterViewInit() {
      this.ngZone.runOutsideAngular(() => {
        this.map = new google.maps.Map(this.gmap.nativeElement, {
          center: this.companyPosition,
          zoom: this.zoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
  
        this.marker = new google.maps.Marker({
          position: this.companyPosition,
          map: this.map,
          title: 'Société XYZ'
        });
      });
    }

    ngOnInit(): void {
      // this.marker=this.companyPosition;
      this.token();
      this.sessionss();
      const savedActiveTabIndex = localStorage.getItem('activeTabIndex');
      if (savedActiveTabIndex) {
        this.activeTab = +savedActiveTabIndex;
      } else {
        this.activeTab = 0; // Définir l'onglet par défaut si aucun n'est trouvé dans le stockage local
      }

      this.apprenantService.getTheme().subscribe(
        t => {
          console.log(t)
          this.DemandeTheme(t);
        },
        error => {
          console.error('Error fetching demandes:', error);
          this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );

    }
    onTabChange(event: number): void {
      this.activeTab = event;
      // Stocker l'index de l'onglet actif dans le stockage local
      localStorage.setItem('activeTabIndex', event.toString());
    }
    

    sessionss(){
      this.apprenantService.getCurrentSessions().subscribe(
        prof => {
          this.session = prof;
          // this.sessions.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          console.log('sessions:', this.session);
         
        },
        error => {
          console.error('Error fetching detail:', error);
          this.snackBar.open('Error .', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );
    }
    
inscrire(){
  const dialogRef = this.dialog.open(PostulerComponent,{
    width:'65%',
    height:'85%'
  });
}
token(){
  this.authService.isExpired().subscribe(
    expired => {
      this.isExpired = expired;
      console.log('isExpired: ', this.isExpired);
      if (this.isExpired) {
      this.snackBar.open('Votre session a expiré, veuillez vous reconnecter.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      UserStorageService.SignOut();  
      localStorage.setItem('activeTabIndex', '0');
      this.router.navigateByUrl('/');
        
      }
    },
    error => {
      console.error('Error fetching demandes:', error);
      this.snackBar.open('Votre session a expiré, veuillez vous reconnecter.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      // this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      UserStorageService.SignOut();
      this.router.navigateByUrl('/');

    }
  );

}

currentDate=new Date();

compare(debut:any,fin:any){
  let currentTime = new Date().toLocaleTimeString();
  return currentTime>=debut && currentTime<=fin;
}

openSessionModal(session: any): void {
  const dialogRef = this.dialog.open(SessionDetailsComponent, {
    width: '55%',
    height: '70%',
    data: { session }
  });
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
  });
}
logout(){
  UserStorageService.SignOut();
  localStorage.setItem('activeTabIndex', '0');
  this.router.navigateByUrl('');
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
