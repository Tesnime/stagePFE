import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, RouterModule } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ApprenantService } from '../../../Services/apprenant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApprenantDetailsComponent } from '../../../formateur/modal/apprenant-details/apprenant-details.component';
import { UserStorageService } from '../../../Services/storage/user-storage.service';

@Component({
  selector: 'app-session-terminer',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,CommonModule,MatListModule, RouterModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule, NgbNavModule,
    MatStepperModule,FormsModule,ReactiveFormsModule
  ],
  templateUrl: './session-terminer.component.html',
  styleUrl: './session-terminer.component.css'
})
export class SessionTerminerComponent {
  active = 'top';
  isPresent:any;
  session=this.data.session;
  comments:any;
  commentForm!:FormGroup;
  Sessions:any[]=[];
  userId:any;
  sess:any={};
  responseMessage: string | null = null;
  certif:any[]=[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private apprenantService:ApprenantService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,
    private fb:FormBuilder,
   ) {}

  ngOnInit(): void {
    this.userId= UserStorageService.getUserId()
    console.log(this.session)
    this.commentForm=this.fb.group({
      comment: ['',Validators.required],
      
    });

    this.apprenantService.SessionByDemande(this.session.demande.id).subscribe(
      prof => {
        this.Sessions = prof;
        
      },
      error => {
        console.error('Error fetching profile:', error);
        this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
    this.apprenantService.CertificateappDem(this.session.demande.id).subscribe(
      prof => {
        this.certif = prof;
        
      },
      error => {
        console.error('Error fetching profile:', error);
        this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );

    this.apprenantService.getDonnee(this.session.id).subscribe(
      prof => {
        this.isPresent = prof;
        console.log(this.isPresent)
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


  }

  openApprenant(app : any){
    const dialogRef = this.dialog.open(ApprenantDetailsComponent,{
      width:'45%',
      height:'60%',
      data: { apprenant:app} 
    });
  }

  comment(){
    if(this.commentForm.valid){
      this.apprenantService.comment(this.commentForm.value,this.data.id).subscribe((res)=>{
        if(res.id != null){
          this.snackBar.open('ajout avec succes!','close',{duration:5000});
          // this.router.navigateByUrl('formateur/home');
          location.reload();
        }
        else{
          this.snackBar.open('signup failed,Please try again.','close',{duration:5000,panelClass:'error-snackbar'});
        }
      })
    }else{
      this.snackBar.open('Veuillez remplir tous les champs obligatoires.','close',{duration:5000,panelClass:'error-snackbar'});
    }
  }
  viewCertif(id: number): void {
    this.apprenantService.Certificate(id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (error) => {
        this.responseMessage = `Failed to fetch certificate content: ${error.message}`;
      }
    });
  }
}
