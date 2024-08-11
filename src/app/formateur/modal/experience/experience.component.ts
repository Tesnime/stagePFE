import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormateurService } from '../../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,FormsModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,CommonModule,MatCheckboxModule,JsonPipe,MatSelectModule, MatSelectModule,
    MatOptionModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent implements OnInit {
  exprForm!:FormGroup;

  constructor(private router: Router,
    private fb:FormBuilder,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar) {
    }
  ngOnInit(): void {
    this.exprForm=this.fb.group({
      working: [false],
      poste: ['',Validators.required],
      entreprise: ['',Validators.required],
      lieu: ['',Validators.required],
      debut: ['',Validators.required],
      fin: [{value: '', disabled: false }]
      
    });

    this.exprForm.get('working')?.valueChanges.subscribe(currentlyWorking => {
      if (currentlyWorking) {
        this.exprForm.get('fin')?.disable(); // Disable 'fin' control if currently working
      } else {
        this.exprForm.get('fin')?.enable(); // Enable 'fin' control if not currently working
      }
    });
  }

  addExpr():void{
    if(this.exprForm.valid){
      console.log(this.exprForm.value)
      this.formateurService.expr(this.exprForm.value).subscribe((res)=>{
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
