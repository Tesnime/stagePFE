import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FormateurService } from '../../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,FormsModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,CommonModule,MatSelectModule],
  templateUrl: './formation.component.html',
  styleUrl: './formation.component.css'
})
export class FormationComponent {
  formationForm!:FormGroup;

  constructor(private router: Router,
    private fb:FormBuilder,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar) {}


  ngOnInit(): void {
    this.formationForm=this.fb.group({
      diplome: ['',Validators.required],
      etablissement: ['',Validators.required],
      specialite: ['',Validators.required],
      date: ['',Validators.required],
      preuve: ['']
      
    });
  }

  addFormation():void{
    console.log(this.formationForm.valid)
    if(this.formationForm.valid){
      console.log(this.formationForm.value)
      this.formateurService.form(this.formationForm.value).subscribe((res)=>{
        if(res.id != null){
          this.snackBar.open('ajout avec succes!','close',{duration:5000});
          // this.router.navigateByUrl('formateur/home');
          setTimeout(() => {
            location.reload();
          }, 3000);
        }
        else{
          this.snackBar.open('signup failed,Please try again.','close',{duration:5000,panelClass:'error-snackbar'});
        }
      })
    }else{
      this.snackBar.open('Veuillez remplir tous les champs obligatoires.','close',{duration:5000,panelClass:'error-snackbar'});

    }
  }

  generateYears(startYear: number, endYear: number): number[] {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  }
}
