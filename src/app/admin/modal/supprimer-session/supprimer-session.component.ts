import { Session } from 'inspector';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { AdminService } from '../../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-supprimer-session',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './supprimer-session.component.html',
  styleUrl: './supprimer-session.component.css'
})
export class SupprimerSessionComponent {
    constructor(  @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService:AdminService,
    private snackBar:MatSnackBar,
    ) {}
  
    supprimer(){
      this.adminService.deleteSession(this.data.session.id).subscribe(
        data =>{
          console.log('delete response',data);
          alert('supprimer avec succes.');  
        }
      )
    }

}
