import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, RouterModule } from '@angular/router';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ApprenantDetailsComponent } from '../apprenant-details/apprenant-details.component';
import { PresenceComponent } from '../presence/presence.component';
import { FormateurService } from '../../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionComponent } from '../../session/session.component';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-session-terminer',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,NgbAlertModule,CommonModule,MatListModule, RouterModule,
    MatExpansionModule,MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule, NgbNavModule,
    MatStepperModule,FormsModule,ReactiveFormsModule
  ],
  templateUrl: './session-terminer.component.html',
  styleUrl: './session-terminer.component.css'
})
export class SessionTerminerComponent {
  session:any;
  receivedData:any;
  comments:any;
  commentForm!:FormGroup;
  active = 'top';
  isPresent:any;

 

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
        console.log(this.session)
      },
      error => {
        console.error('Error fetching detail:', error);
        this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
    
    this.commentForm=this.fb.group({
      comment: ['',Validators.required],
      
    });

    this.formateurService.isPresent(this.data.id).subscribe(
      prof => {
        this.isPresent = prof;
      },
      error => {
        console.error('Error fetching profile:', error);
        this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
  }

  openSnackBar():void{
    this.snackBar.open("Votre présence a bien été enregistrée. Merci d'être présent(e)!", 'Close', { duration: 5000});
    
  }
  evaluer(id:number):void{
    this.router.navigate([`/formateur/evaluation`],{queryParams: { key: id }} )
    this.dialogRef.close();

  }
  comment(){
    if(this.commentForm.valid){
      this.formateurService.comment(this.commentForm.value,this.data.id).subscribe((res)=>{
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
