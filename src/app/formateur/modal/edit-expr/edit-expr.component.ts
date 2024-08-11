import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FormateurService } from '../../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import exp from 'constants';

@Component({
  selector: 'app-edit-expr',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,FormsModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,CommonModule,MatCheckboxModule,JsonPipe],
  templateUrl: './edit-expr.component.html',
  styleUrl: './edit-expr.component.css'
})
export class EditExprComponent {
  
  exprForm!:FormGroup;
  expr:any;

  constructor(private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar) {
    }
  ngOnInit(): void {

    this.formateurService.exprByid(this.data).subscribe(
      prof => {
        this.expr = prof;
        this.initializeForm();
        console.log(prof);
        console.log(this.expr);
      },
      error => {
        console.error('Error fetching expr:', error);
        this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
   
  }

  private initializeForm(): void {
    console.log('gg '+this.expr.poste);
    this.exprForm=this.fb.group({
      working:[ this.expr.working],
      entreprise: [this.expr.entreprise,Validators.required],
      lieu: [this.expr.lieu,Validators.required],
      debut: [this.expr.debut,Validators.required],
      poste: [this.expr.poste,Validators.required],
      fin: [{value: this.expr.fin, disabled: this.expr.working}]
      
    });
    this.exprForm.get('working')?.valueChanges.subscribe(currentlyWorking => {
    
      if (currentlyWorking) {
        this.exprForm.get('fin')?.disable(); 
      } else {
        this.exprForm.get('fin')?.enable();
      }
    });
  }
    updateExpr():void{ 
      if(this.exprForm.valid){
        console.log(this.exprForm.value)
        this.formateurService.editExpr(this.exprForm.value,this.data).subscribe((res)=>{
          if(res.id != null){
            this.snackBar.open('modifier avec succes!','close',{duration:5000});
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
