import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormateurService } from '../../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { SessionComponent } from '../../session/session.component';
import {MatStepperModule} from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApprenantDetailsComponent } from '../apprenant-details/apprenant-details.component';
import { PresenceComponent } from '../presence/presence.component';
import { interval, Subscription } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-session-details',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,NgbAlertModule,CommonModule,MatListModule, RouterModule,
    MatExpansionModule,MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,NgbNavModule, NgbNavModule,
    MatStepperModule,FormsModule,ReactiveFormsModule
  ],
  templateUrl: './session-details.component.html',
  styleUrl: './session-details.component.css'
})
export class SessionDetailsComponent {
  session:any;
  receivedData:any;
  comments:any;
  commentForm!:FormGroup;
  active = 'top';
  sess:any= {};;
  sessionStartTime = ''; // heure de début de la session sous forme de chaîne
  timeLeft: number = 0; // temps restant en secondes
  hour: number = 0;
  min: number = 0;
  sec: number = 0;

  private subscription!: Subscription;

 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder,
    private router: Router,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SessionComponent>) {}

  ngOnInit(): void {
    console.log('datahh: '+ JSON.stringify(this.data))
    this.formateurService.getComment(this.data.id).subscribe(
      prof => {
        this.comments = prof;
        // console.log('comments:', this.comments);
      },
      error => {
        console.error('Error fetching detail:', error);
        this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
    this.formateurService.session(this.data.id).subscribe(
      prof => {
        this.session = prof;
        this.startCountdown(this.session.debut);
        this.formateurService.firstAndLastSession(this.session.demande.id).subscribe(
          prof => {
            this.sess = prof;
            console.log('sess:', this.sess);
          },
          error => {
            console.error('Error fetching detail:', error);
            this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
          }
        );
      },
      error => {
        console.error('Error fetching detail:', error);
        this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
    
    this.commentForm=this.fb.group({
      comment: ['',Validators.required],
      
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  startCountdown(date:any) {
    const sessionTime = new Date();
    const [hours, minutes, seconds] = date.split(':').map(Number);
    sessionTime.setHours(hours, minutes, seconds, 0);

    this.updateTimeLeft(sessionTime);

    // Met à jour le temps restant chaque seconde
    this.subscription = interval(1000).subscribe(() => {
      this.updateTimeLeft(sessionTime);
    });
  }

  updateTimeLeft(sessionTime: Date): void {
    const currentTime = new Date();
    const timeDifference = sessionTime.getTime() - currentTime.getTime();

    if (timeDifference > 0) {
      this.timeLeft = Math.floor(timeDifference / 1000);
      this.hour = Math.floor(this.timeLeft / 3600);
      this.min = Math.floor((this.timeLeft % 3600) / 60);
      this.sec = this.timeLeft % 60;
    } else {
      this.timeLeft = 0;
    }
  }
  openSnackBar():void{
    this.snackBar.open("Votre présence a bien été enregistrée. Merci d'être présent(e)!", 'Close', { duration: 5000});
    
  }
  evaluer(id:number):void{
    this.router.navigate([`/formateur/evaluation`],{queryParams: { key: id }} )
    this.dialogRef.close();

  }
  comment(){
    if (this.commentForm.valid) {
      const commentValue = this.commentForm.get('comment')?.value;


  
      // Vérification des termes inappropriés
      this.formateurService.checkAnswer(commentValue).subscribe((res) => {
        if (!res) {
          // Si des termes inappropriés sont détectés
          alert("Des termes inappropriés ont été détectés dans votre commentaire, ce qui empêche son envoi.");
        } else {
          // Si tout est correct, soumettre le commentaire
          this.formateurService.comment(this.commentForm.value, this.session.id).subscribe((response) => {
            if (response && response.id != null) {
              this.snackBar.open('Ajout avec succès!', 'Fermer', { duration: 5000 });
              location.reload();
            } else {
              this.snackBar.open('L\'ajout a échoué. Veuillez réessayer.', 'Fermer', {
                duration: 5000,
                panelClass: 'error-snackbar'
              });
            }
          });
        }
      });
    } else {
      this.snackBar.open('Le formulaire est invalide. Veuillez vérifier les champs.', 'Fermer', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
    }
  }
  openApprenant(app : any){
    const dialogRef = this.dialog.open(ApprenantDetailsComponent,{
      width:'45%',
      height:'60%',
      data: { apprenant:app} 
    });
  }
  openPresence(session: any): void {
    const dialogRef = this.dialog.open(PresenceComponent, {
      width: '45%',
      height: '60%',
      data: { session }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
