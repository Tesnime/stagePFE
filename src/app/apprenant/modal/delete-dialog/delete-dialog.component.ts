import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ApprenantService } from '../../../Services/apprenant.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css'
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apprenantService:ApprenantService,
    private snackBar:MatSnackBar,
    ) {}
    supprimer() {
      this.apprenantService.deletetache(this.data.id).subscribe(
        response => {
          this.snackBar.open('Tâche supprimée avec succès.', 'Close', { duration: 5000 });
          this.dialogRef.close(true); // Fermer le dialogue et retourner true
        },
        error => {
          this.snackBar.open('Erreur lors de la suppression de la tâche.', 'Close', { duration: 5000 });
          this.dialogRef.close(false); // Fermer le dialogue et retourner false en cas d'erreur
        }
      );
    }
}
