import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { AdminService } from '../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SessionDetailsComponent } from '../../formateur/modal/session-details/session-details.component';
import { DemandeDetailsComponent } from '../modal/demande-details/demande-details.component';
import { MatButtonModule } from '@angular/material/button';
import { PlanificationDesSessionsComponent } from '../modal/planification-des-sessions/planification-des-sessions.component';
import { DemandeproposerComponent } from '../modal/demandeproposer/demandeproposer.component';
import { DemandeAccComponent } from '../modal/demande-acc/demande-acc.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-demandes',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatExpansionModule,MatTableModule, MatSortModule, MatPaginatorModule,CommonModule,MatButtonModule,MatIconModule,],
  templateUrl: './demande.component.html',
  styleUrl: './demande.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemandesComponent{

  demande:any;
  accepte=0;
  enCours=0;
  refuse=0;

  step = signal(0);

  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update(i => i + 1);
  }

  prevStep() {
    this.step.update(i => i - 1);
  }
 

  constructor(private adminService:AdminService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,){
    }

    ngOnInit(): void {
    
      this.adminService.demandes().subscribe(
        demandes => {
          this.demande =demandes.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
          console.log('demandes:', this.demande);
          this.calculateDemandeStatusCounts();
        },
        error => {
          console.error('Error fetching demandes:', error);
          this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );
     
     
    }
  
    openDialog(id:number) {
      const dialogRef = this.dialog.open(DemandeDetailsComponent,{
        width:'75%',
        height:'90%',
        data: { id: id} 
      });
    }

    openSession(id:number) {
      const dialogRef = this.dialog.open(DemandeproposerComponent,{
        width:'75%',
        height:'90%',
        data: { id: id} 
      });
    }

    openDemande(demande:any) {
      const dialogRef = this.dialog.open(DemandeAccComponent,{
        width:'75%',
        height:'90%',
        data: { demande: demande} 
      });
    }

    planifier() {
      const dialogRef = this.dialog.open(PlanificationDesSessionsComponent,{
        width:'75%',
        height:'90%',
        
      });
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
      });
      }
}
