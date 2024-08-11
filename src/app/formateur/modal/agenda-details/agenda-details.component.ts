import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-agenda-details',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,CommonModule],
  templateUrl: './agenda-details.component.html',
  styleUrl: './agenda-details.component.css'
})
export class AgendaDetailsComponent {
  session:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.session=this.data;
    console.log('hello:  '+ JSON.stringify(this.session));
  }

 

  }
