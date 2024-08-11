import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { FormateurService } from '../../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-annuler',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './annuler.component.html',
  styleUrl: './annuler.component.css'
})
export class AnnulerComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar,
    ) {}
  annuler(){
    this.formateurService.deleteDemande(this.data).subscribe(
      data =>{
        console.log('delete response',data);
        this.snackBar.open('supprimer avec succes.', 'Close', { duration: 5000 });
        setTimeout(() => {
          location.reload();
        }, 3000);
      }
    )
  }

}
