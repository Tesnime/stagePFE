import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { ApprenantService } from '../../../Services/apprenant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-star',
  standalone: true,
  imports: [NgbRatingModule,MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './star.component.html',
  styleUrl: './star.component.css'
})
export class StarComponent {
  rating = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router:Router,
    private apprenantService:ApprenantService,
    private snackBar:MatSnackBar,
    ) {}
    envoyer(){
      console.log(this.data.session.demande.id)
      this.apprenantService.star(this.rating,this.data.session.demande.id).subscribe(response => {
        console.log("Success:", response);
        this.snackBar.open('envoyer avec succes!','close',{duration:5000});
       
        // this.router.navigateByUrl('formateur/home');
    },
    error => {
      console.error("Error:", error);
      this.snackBar.open(' Vous avez déjà noté la session. ','close',{duration:5000,panelClass:'error-snackbar'});

    })
    }
}
