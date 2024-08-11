import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Observable, Subscription, timer } from 'rxjs';
import { AdminService } from '../../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormateurService } from '../../../Services/formateur.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-presence',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,CommonModule,FormsModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule],
  templateUrl: './presence.component.html',
  styleUrl: './presence.component.css'
})
export class PresenceComponent {
 
    session=this.data.session;
    apprenant:any;
    code=false;
    confirm=false;
    mailForm!:FormGroup;
    codeForm!:FormGroup;
    timeLeft: number = 240; 
    interval: number = 1000; 
    timer$!: Observable<number>;
    timerSubscription!: Subscription;
    minutesDisplay!: number;
    secondsDisplay!: number;
    isPresent:any;
    
  
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formateurService:FormateurService,
      private fb:FormBuilder,
      private snackBar:MatSnackBar){
        this.mailForm = this.fb.group({
          mail: ['', Validators.required],
        });
    
        this.codeForm = this.fb.group({
          code: ['', Validators.required],
        });
      }
  
      ngOnInit(): void {
        
        // console.log('Presence session: '+ this.session)
        // this.codeForm=this.fb.group({
        //   code:[ '',Validators.required],
        // });
        this.profile();
  
        this.formateurService.isPresent(this.session.id).subscribe(
          prof => {
            this.isPresent = prof;
          },
          error => {
            console.error('Error fetching profile:', error);
            this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
          }
        );
        // console.log("1 "+this.apprenant.email)
       
        
        
        this.startTimer();
        // console.log("aa"+this.isPresent)
  
      }
      a(){
        console.log("2 "+this.apprenant.email)

        this.mailForm=this.fb.group({
          mail:['',Validators.required],
        });
      }
      
      profile(){
        this.formateurService.profile().subscribe(
          prof => {
            this.apprenant = prof;
            console.log("0 "+this.apprenant.email)
            this.mailForm.get('mail')?.setValue(this.apprenant.email);
          },
          error => {
            console.error('Error fetching profile:', error);
            this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
          }
        );
      }
     
     
      send() {
        this.confirm=true;
        const email = this.mailForm.get('mail')?.value;
        const nom=this.apprenant.firstname+" "+this.apprenant.lastname
      
        const code = this.generateRandomCode();
        
       
      
        this.formateurService.send(email,nom,code).subscribe(
          response => {
            console.log("Success:", response);
            this.snackBar.open('Le code a été envoyé avec succès!', 'close', { duration: 5000 });
            this.apprenant.codeConfirmation = code;
            // this.apprenantService.code(code).subscribe(
            //   response => {
            //     console.log("Success:", response);
            //     
            //   },
            //   error => {
            //     console.log("Error:", error);
            //   }
            // );
            this.code=true;
            this.confirm=false;
          },
          error => {
            console.error("Error:", error);
            this.snackBar.open('Erreur lors de l\'envoi du code..', 'close', { duration: 5000, panelClass: 'error-snackbar' });
          }
        );
      }
      
      generateRandomCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
      }
      ngOnDestroy(): void {
        this.timerSubscription.unsubscribe();
      }
    
      startTimer() {
        this.timer$ = timer(0, this.interval);
        this.timerSubscription = this.timer$.subscribe(() => {
          this.calculateTimeLeft();
        });
      }
    
      calculateTimeLeft() {
        this.minutesDisplay = Math.floor(this.timeLeft / 60);
        this.secondsDisplay = this.timeLeft % 60;
    
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.timerSubscription.unsubscribe();
          this.apprenant.codeConfirmation = null;
          // Handle timer expiration
          console.log('Timer expired!');
        }
      }
      present() {
          if (this.apprenant.codeConfirmation ===this.codeForm.get('code')?.value) {
            this.formateurService.presence(this.session.id, true).subscribe(
              response => {
                this.snackBar.open('Présence marquée avec succès.', 'close', { duration: 5000, panelClass: 'success-snackbar' });
                
                this.isPresent=true
              },
              error => {
                this.snackBar.open('Erreur lors de la marquage de la présence.', 'close', { duration: 5000, panelClass: 'error-snackbar' });
              }
            );
          } else {
            this.snackBar.open('Entrez le code valide.', 'close', { duration: 5000, panelClass: 'error-snackbar' });
          }
      
      }
        
      
       terminer(){
          location.reload();
       }
     
      
  
  }
  

