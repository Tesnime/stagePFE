import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { AdminService } from '../../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-formateur',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './add-formateur.component.html',
  styleUrl: './add-formateur.component.css'
})
export class AddFormateurComponent {
  constructor(  @Inject(MAT_DIALOG_DATA) public data: any,
  private adminService:AdminService,
  private snackBar:MatSnackBar,
  ) {}

  addFormateur(){
    this.adminService.addFormateur(this.data.demande.id,this.data.formateur.id).subscribe((res)=>{
      if(res.id != null){
        alert('formateur ajouter avec succes!');
      }
      else{
        this.snackBar.open('Erreur!','close',{duration:5000,panelClass:'error-snackbar'});
      }
    })
  }


}
