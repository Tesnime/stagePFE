import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [MatButtonModule,],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
  @ViewChild('mapContainer', { static: false }) gmap!: ElementRef;
  map!: google.maps.Map;
  marker!: google.maps.Marker;
  display: any;

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
    private router:Router,
    private ngZone: NgZone
  ){}

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

  signup(){
    this.router.navigateByUrl('/signup')

  }
  login(){
    this.router.navigateByUrl('/login')

  }

}
