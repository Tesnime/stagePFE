import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApprenantService } from '../../Services/apprenant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { DeleteDialogComponent } from '../modal/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-to-do',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './to-do.component.html',
  styleUrl: './to-do.component.css'
})
export class ToDoComponent {
taches:any;
newTask: string = '';

constructor(
  private apprenantService:ApprenantService,
  private snackBar:MatSnackBar,
  public dialog: MatDialog,
) {}
ngOnInit(): void {
  this.apprenantService.getTache().subscribe(
    tache => {
      this.taches = tache;
    },
    error => {
      console.error('Error fetching tache:', error);
      this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
    }
  );
}

addItem(): void {
  if (this.newTask.trim()) {
    this.apprenantService.addTache(this.newTask).subscribe(
      (response: any) => { // Assuming response is the newly created task
        this.taches.push(response); // Add the new task to the list
        this.newTask = ''; // Clear the input field
        this.snackBar.open('Task added successfully.', 'Close', { duration: 5000 });
      },
      error => {
        console.error('Error adding task:', error);
        this.snackBar.open('Error adding task. Please try again.', 'Close', { duration: 5000 });
      }
    );
  } else {
    this.snackBar.open('Please enter a task.', 'Close', { duration: 5000 });
  }
}

removeItem(id: number, index: number) {
  const dialogRef = this.dialog.open(DeleteDialogComponent, {
    width: '450px',
    data: { id: id }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.taches.splice(index, 1); // Supprime l'élément de la liste sans recharger la page
    }
  });
}

}
