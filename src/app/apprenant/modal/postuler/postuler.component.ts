import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApprenantService } from '../../../Services/apprenant.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-postuler',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule , MatInputModule, MatFormFieldModule, CommonModule, MatDialogModule,MatButtonModule],
  templateUrl: './postuler.component.html',
  styleUrl: './postuler.component.css'
})
export class PostulerComponent {
  postForm!: FormGroup ;

  constructor(
    private fb:FormBuilder,
    private apprenantService:ApprenantService,
    private snackBar:MatSnackBar,
    ) {}

  ngOnInit(): void {
    this.postForm=this.fb.group({
      code: ['',Validators.required],
    });
  }

  postuler(): void {
    if (this.postForm.valid) {
      const code = this.postForm.get('code')?.value;
  
      this.apprenantService.postuler(code).subscribe(
        response => {
          console.log("Success:", response);
          this.snackBar.open('Inscription avec succès!', 'close', { duration: 5000 });
  
          this.apprenantService.demandeIdByCode(code).subscribe(
            demandeId => {
              console.log("demandeId:  "+demandeId)
              this.apprenantService.sendConfirmation('tesnime139@gmail.com', 'tesnime', demandeId).subscribe(
                response => {
                  console.log("Confirmation email sent successfully:", response);
                },
                error => {
                  console.error("Failed to send confirmation email:", error);
                  this.snackBar.open('Échec de l\'envoi de l\'email. Veuillez réessayer.', 'close', { duration: 5000, panelClass: 'error-snackbar' });
                }
              );
            },
            error => {
              console.error("Failed to retrieve demande ID:", error);
              this.snackBar.open('Échec de récupération de l\'ID de la demande.', 'close', { duration: 5000, panelClass: 'error-snackbar' });
            }
          );
  
          this.apprenantService.ajoutAuPresent(code).subscribe(
            response => {
              console.log("Added to present successfully:", response);
            },
            error => {
              console.error("Failed to add to present:", error);
              this.snackBar.open('Échec de l\'ajout. Veuillez réessayer.', 'close', { duration: 5000, panelClass: 'error-snackbar' });
            }
          );
  
          setTimeout(() => {
            location.reload();
          }, 3000);
        },
        error => {
          console.error("Error:", error);
          this.snackBar.open('Le code que vous avez saisi est invalide. Veuillez saisir un code valide.', 'close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );
    } else {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires.', 'close', { duration: 5000, panelClass: 'error-snackbar' });
    }
  }
  

}
