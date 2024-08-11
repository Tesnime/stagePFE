import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { AdminService } from '../../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-apprenant-details',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,CommonModule,MatListModule],
  templateUrl: './apprenant-details.component.html',
  styleUrl: './apprenant-details.component.css'
})
export class ApprenantDetailsComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminService:AdminService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,
    ) {}

    apprenants=this.data.apprenant;

}
