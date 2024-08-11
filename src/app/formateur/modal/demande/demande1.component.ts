import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormateurService } from '../../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CompleteComponent } from '../complete/complete.component';
import { log } from 'console';
import { DemandeComponent } from '../../demande/demande.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-demande1',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatDialogModule,MatButtonModule],
  templateUrl: './demande.component.html',
  styleUrl: './demande.component.css'
})
export class Demande1Component {
  demandeForm!:FormGroup;
  profile:any;
  constructor(private router: Router,
    private fb:FormBuilder,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DemandeComponent>
   ) {}
  ngOnInit(): void {
    this.formateurService.profile().subscribe(
      prof => {
        this.profile = prof;
        console.log('profile:', this.profile);
      },
      error => {
        console.error('Error fetching profile:', error);
        this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
    this.demandeForm=this.fb.group({
      doc: [''],
      description: ['',Validators.required],
      titre: ['',Validators.required],
      nbrSession: ['',Validators.required],
      theme: this.fb.array([]),
      
    });
  }
 
  
  
  postuler():void{
    
      // if(this.profile.email=='' || this.profile.cin=='' || this.profile.comTech=='' ||this.profile.competance=='' ||
      //   this.profile.tel=='' || this.profile.cv=='' ){
      //     this.dialogRef.close();
      //       this.dialog.open(CompleteComponent);
      // }
      // else
       if(this.demandeForm.valid){
        // this.formateurService.postuler(this.demandeForm.value).subscribe((res)=>{
        //   if(res.id != null){
        //     this.snackBar.open('ajout avec succes!','close',{duration:5000});
        //     // this.router.navigateByUrl('formateur/home');
        //     location.reload();
        //   }
        //   else{
        //     this.snackBar.open('signup failed,Please try again.','close',{duration:5000,panelClass:'error-snackbar'});
        //   }
        // })
          this.formateurService.postuler(this.demandeForm.value).subscribe(
          response => {
            this.snackBar.open('envoyer avec succes!','close',{duration:5000});
            location.reload();
          },
          error =>{
            this.snackBar.open('ajout failed,Please try again.','close',{duration:5000,panelClass:'error-snackbar'});
          }
        );
      }else{
        this.snackBar.open('Veuillez remplir tous les champs obligatoires.','close',{duration:5000,panelClass:'error-snackbar'});
      }
    }

}
