import { MatChipsModule } from '@angular/material/chips';
import { Component, Injectable, TemplateRef, ViewChild, inject } from '@angular/core';
import { NavbarComponent } from '../navs/navbar/navbar.component';
import { NavComponent } from '../navs/nav/nav.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormateurService } from '../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { DetailsComponent } from '../modal/details/details.component';
import { Demande1Component } from '../modal/demande/demande1.component';
import { NgbModal, NgbNavModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import {MatMenuTrigger, MatMenuModule} from '@angular/material/menu';
import { CompleteComponent } from '../modal/complete/complete.component';
import { AnnulerComponent } from '../modal/annuler/annuler.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { Subject } from 'rxjs';




@Component({
  selector: 'app-demande',
  standalone: true,
  imports: [NavbarComponent,NavComponent,MatPaginatorModule,MatIconModule,MatMenuModule,CommonModule,MatProgressSpinnerModule,MatDialogModule,Demande1Component,MatButtonModule,NgbNavModule, MatChipsModule,NgbNavModule,MatCardModule,MatListModule,NgbToastModule,MatFormFieldModule, MatInputModule],
  templateUrl: './demande.component.html',
  styleUrl: './demande.component.css',
  // providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],
})
export class DemandeComponent {
  demande:any;
  demProp:any[]=[];
  filteredDemande:any;
  filteredDemProp: any[] = [];
  selectedDemandeId: number | null = null;
  active = 'tous';
  accepte=0;
  enCours=0;
  refuse=0;
  prop=0;
  // id=localStorage.getItem('userId');
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger | undefined;
  

  constructor(private router: Router,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog) {}
  ngOnInit(): void {
    // console.log("id  ",this.id)
    this.formateurService.demandes().subscribe(
      prof => {
        this.demande = prof.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.filteredDemande=prof;
        console.log('demandes:', this.demande);
        this.calculateDemandeStatusCounts();
      },
      error => {
        console.error('Error fetching demandes:', error);
        this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );

    this.formateurService.demandeProp().subscribe(
      prof => {
        this.demProp = prof;
        this.filteredDemProp = prof;
        // this.filteredDemande=prof;
        console.log('demandes:', this.demProp);
      },
      error => {
        console.error('Error fetching demandes:', error);
        this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );

   
  }

  calculateDemandeStatusCounts(): void {
    
  
    this.demande.forEach((demand: { status: any; }) => {
      switch (demand.status) {
        case 'traitement':
          this.enCours+=1
          break;
        case 'accept':
          this.accepte+=1;
          break;
        case 'refus':
          this.refuse++;
          break;
        default:
          break;
      }
    console.log('accept'+this.accepte)

    });
    }
 
  openDialog(id:number) {
    const dialogRef = this.dialog.open(DetailsComponent,{
      width:'50%',
      height:'85%',
      data: { id: id} 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog1(id:number){
    const dialogRef = this.dialog.open(AnnulerComponent, {
      restoreFocus: false,
      data:id
    });

    // Manually restore focus to the menu trigger since the element that
    // opens the dialog won't be in the DOM any more when the dialog closes.
    dialogRef.afterClosed().subscribe(() => this.menuTrigger!.focus());
  }

  private modalService = inject(NgbModal);
  openVerticallyCentered() {
    const dialogRef = this.dialog.open(Demande1Component,{
      width:'50%',
      height:'75%'
    })
}
deleteDemande(id:number){
  this.formateurService.postulerDem(id).subscribe(
    data =>{
      console.log('demande envoyer!',data);
      this.snackBar.open('demande envoyer avec succes!', 'Close', { duration: 5000 });
    }
  )
}

sendDemande(id:number){
  this.formateurService.deleteDemande(id).subscribe(
    data =>{
      console.log('delete response',data);
      this.snackBar.open('supprimer avec succes.', 'Close', { duration: 5000 });
      setTimeout(() => {
        location.reload();
      }, 2000);
    }
  )
}
toggleDetails(demandeId: number) {
  if (this.selectedDemandeId === demandeId) {
    // Si la carte sélectionnée est déjà celle-ci, la masquer
    this.selectedDemandeId = null;
  } else {
    // Sinon, sélectionner cette carte
    this.selectedDemandeId = demandeId;
  }
}
applyFilter(value: string): void {
  const lowerCaseValue = value.toLowerCase().trim();
  console.log('filter ' + lowerCaseValue);

  this.filteredDemProp = this.demProp.filter((demande: any) => {
    // Check if 'theme' is a string or an array and handle accordingly
    const theme = demande.demande.theme;
    
    if (Array.isArray(theme)) {
      // If theme is an array, check if any of the elements match the filter value
      return theme.some(tag => tag.toLowerCase().includes(lowerCaseValue));
    } else if (typeof theme === 'string') {
      // If theme is a string, apply the filter directly
      return theme.toLowerCase().includes(lowerCaseValue);
    } else {
      // Handle cases where 'theme' is neither a string nor an array
      console.warn('Unexpected type for theme:', typeof theme);
      return false;
    }
  });
}

}
