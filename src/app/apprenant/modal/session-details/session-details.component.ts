import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApprenantService } from '../../../Services/apprenant.service';
import { Observable, Subscription, timer } from 'rxjs';
import { StarComponent } from '../star/star.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-details',
  standalone: true,
  imports: [MatDialogModule, MatTabsModule,MatButtonModule,CommonModule,FormsModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule],
  templateUrl: './session-details.component.html',
  styleUrl: './session-details.component.css'
})
export class SessionDetailsComponent {

  session=this.data.session;
  apprenant:any;
  presence=false;
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
  presentcbn=false;
  isPresent:any;
  evalForm!:FormGroup;
  donnee:any;
  comments:any;
  commentForm!:FormGroup;
  fileContent!: SafeResourceUrl;
  responseMessage: string | null = null;
  certif!:any[];
  view=false;
  sess:any={};
  imageUrl!: SafeUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apprenantService:ApprenantService,
    private fb:FormBuilder,
    public dialog: MatDialog,
    private router:Router,
    private snackBar:MatSnackBar,
    private sanitizer: DomSanitizer){}

    ngOnInit(): void {
      this.apprenantService.getComment(this.session.id).subscribe(
        prof => {
          this.comments = prof;
          // console.log('comments:', this.comments);
        },
        error => {
          console.error('Error fetching detail:', error);
          this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );
      this.apprenantService.CertificateappDem(this.session.demande.id).subscribe(
        prof => {
          this.certif = prof;
          this.view=this.certif.length>0;
          if(this.certif.length>0){
            this.viewCertificate(this.certif[0].id)
          }
        },
        error => {
          console.error('Error fetching detail:', error);
          this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );

      this.commentForm=this.fb.group({
        comment: ['',Validators.required],
        
      });
      this.apprenantService.getFormateurImage(this.session.demande.formateur.id).subscribe(
        response => this.createImageFromBlob(response),
        error => console.error(error)
      );
      this.apprenantService.getProfile().subscribe(
        prof => {
          this.apprenant = prof;
          console.log("app "+prof)
        },
        error => {
          console.error('Error fetching profile:', error);
          this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );

      this.apprenantService.firstAndLastSession(this.session.demande.id).subscribe(
        prof => {
          this.sess = prof;
          console.log('sess:', this.sess);
        },
        error => {
          console.error('Error fetching detail:', error);
          this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );

      this.apprenantService.isPresent(this.session.id).subscribe(
        prof => {
          this.isPresent = prof;
        },
        error => {
          console.error('Error fetching profile:', error);
          this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );

      this.evalForm = this.fb.group({
        manuel: [''],
        cartable: [''],
        pauseCafe: [''],
        dejeuner: ['']
      });
     if(this.session.demande.certifications.length>0){
      console.log("id +++++"+this.session.demande.certifications[0].id)
    }else{
      this.apprenantService.modifyCertificate(4, this.session.demande.id).subscribe(
        (response: any) => {
          if (response === 'success') {
            // this.snackBar.open('Success!', 'Close', { duration: 5000 });
          } else {
            // this.snackBar.open('Error!', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
          }
        },
        (error) => {
          // this.snackBar.open('Template chosen successfully.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );
     
    }
  
    console.log("les donnees: "+this.donnee)
   
      this.a();
      this.b();
      this.c();
      this.startTimer();
  //     // console.log("aa"+this.isPresent)

    }
    a(){
      this.mailForm=this.fb.group({
        mail:[ this.apprenant.email,Validators.required],
      });
    }
    b(){
      this.codeForm=this.fb.group({
        code:[ '',Validators.required],
      });
    }
    c() {
      this.apprenantService.getDonnee(this.session.id).subscribe(
        prof => {
          this.donnee = prof;
          console.log("les donnees:", this.donnee);
          if(prof.length>0){
            this.evalForm.patchValue({
              manuel: this.donnee.manuel,
              cartable: this.donnee.cartable,
              pauseCafe: this.donnee.pauseCafe,
              dejeuner: this.donnee.dejeuner
            });
          }
         
        },
        error => {
          console.error('Error fetching profile:', error);
          this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );
    }
    
    press(){
      this.presence=true;

    }
    retour(){
      this.presence=false;
    }
    createImageFromBlob(image: Blob): void {
      
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      }, false);
  
      if (image) {
        reader.readAsDataURL(image);
      }
    }

    send() {
      this.confirm=true;
      const email = this.mailForm.get('mail')?.value;
      const nom=this.apprenant.firstname+" "+this.apprenant.lastname
    
      const code = this.generateRandomCode();
     
    
      this.apprenantService.send(email,nom,code).subscribe(
        response => {
          console.log("Success:", response);
          this.snackBar.open('Le code a été envoyé avec succès!', 'close', { duration: 5000 });
          this.apprenant.codeConfirmation = code;
          this.code=true;
          this.confirm=false;
          this.startTimer();

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
    continue(){
      this.presentcbn=true;
    }
    evaluer(){
      this.router.navigate([`/apprenant/evaluation`],{queryParams: { key: this.session.demande.id }} )
    }
    present() {
        if (this.apprenant.codeConfirmation ===this.codeForm.get('code')?.value) {
          this.apprenantService.presence(this.session.id, true).subscribe(
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
      
    envoyer(){
      if(this.evalForm.valid){
        console.log(this.evalForm.value)
        this.apprenantService.donnee(this.session.id,this.evalForm.value).subscribe(
          response => {
            this.snackBar.open('envoyer avec succes!','close',{duration:5000});
            if(this.session.id == this.sess['lastSessionId']){
            const dialogRef = this.dialog.open(StarComponent, {
              width: '30%',
              height: '30%',
              data: { session:this.session }
            });
          }
          },
          error =>{
            this.snackBar.open('signup failed,Please try again.','close',{duration:5000,panelClass:'error-snackbar'});
          }
        );
      }else{
        this.evalForm.markAllAsTouched();
      }
    }
    
     terminer(){
        location.reload();
     }
     comment() {
      if (this.commentForm.valid) {
        const commentValue = this.commentForm.get('comment')?.value;


    
        // Vérification des termes inappropriés
        this.apprenantService.checkAnswer(commentValue).subscribe((res) => {
          if (!res) {
            // Si des termes inappropriés sont détectés
            alert("Des termes inappropriés ont été détectés dans votre commentaire, ce qui empêche son envoi.");
          } else {
            // Si tout est correct, soumettre le commentaire
            this.apprenantService.comment(this.commentForm.value, this.session.id).subscribe((response) => {
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
    

  //   confirmerModele() {
  //     this.apprenantService.modifyCertificateApp(this.session.demande.certifications[0].id).subscribe();
  //     this.view=true;
      
      
  //   }
  //   viewCertificate(id: number): void {
  //     this.apprenantService.Certificate(id).subscribe({
  //       next: (blob) => {
  //         const reader = new FileReader();
  //         reader.onload = (e) => {
  //           const unsafeUrl = URL.createObjectURL(blob);
  //           this.fileContent = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  //         };
  //         reader.readAsDataURL(blob);
  //       },
  //       error: (error) => {
  //         this.responseMessage = `Failed to fetch certificate content: ${error.message}`;
  //       }
  //     });
  //   }
  // }

  confirmerModele() {
    this.apprenantService.modifyCertificateApp(this.session.demande.certifications[0].id).subscribe({
      next: () => {
        this.view = true;
        // Appel pour récupérer le modèle de l'attestation après la modification
        this.viewCertificate(this.session.demande.certifications[0].id);
      },
      error: (error) => {
        this.responseMessage = `Failed to modify certificate: ${error.message}`;
      }
    });
  }

  viewCertificate(id: number): void {
    this.apprenantService.Certificate(id).subscribe({
      next: (blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          const unsafeUrl = URL.createObjectURL(blob);
          this.fileContent = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
        };
        reader.readAsDataURL(blob);
      },
      error: (error) => {
        this.responseMessage = `Failed to fetch certificate content: ${error.message}`;
      }
    });
  }
}

