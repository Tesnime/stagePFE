import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DemandeComponent } from '../../demande/demande.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule],
  templateUrl: './complete.component.html',
  styleUrl: './complete.component.css'
})
export class CompleteComponent {
constructor(
  public route:Router,
  public dialogRef: MatDialogRef<DemandeComponent>){
  
}
ngOnInit(): void{
  // this.dialogRef.close();
}
complete():void{
  this.route.navigateByUrl('/formateur/profile');
  this.dialogRef.close();
}

}
