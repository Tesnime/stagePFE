import { ApprenantService } from './../../../Services/apprenant.service';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [FormsModule, MatRadioModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatButtonModule, MatDividerModule,],
  templateUrl: './evaluation.component.html',
  styleUrl: './evaluation.component.css'
})
export class EvaluationComponent {
  evalForm!:FormGroup;
  key:any;

  constructor( 
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder,
    private apprenantService:ApprenantService,
    private snackBar:MatSnackBar,
    private router:Router,
    private route: ActivatedRoute) {}
 


  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      this.key = params['key'];
      console.log('Key:', this.key);
      
    });
    // this.formateurService.session(this.receivedData).subscribe(
    //   prof => {
    //     this.session = prof;
    //     console.log('session:', this.session);
    //   },
    //   error => {
    //     console.error('Error fetching detail:', error);
    //     this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
    //   }
    // );
    this.evalForm=this.fb.group({
      q1: [''],
      comQ1: [''],
      q2: [''],
      comQ2: [''],
      q3: [''],
      comQ3: [''],
      q4: [''],
      comQ4: [''],
      q5: [''],
      comQ5: [''],
      q6: [''],
      comQ6: [''],

      
    });
  }

  envoyer(){
    
    if(this.evalForm.valid){
      console.log('heloo')
      console.log(this.evalForm.value)
      this.apprenantService.evaluation(this.evalForm.value,this.key).subscribe((res)=>{
        if(res.id != null){
          this.snackBar.open('ajout avec succes!','close',{duration:5000});
          this.router.navigateByUrl('apprenant/home');
         
        }
        else{
          this.snackBar.open('signup failed,Please try again.','close',{duration:5000,panelClass:'error-snackbar'});
          this.snackBar.open('Vous avez deja evoyer votre evaluation .','close',{duration:5000,panelClass:'error-snackbar'});

        }
      })
    }else{
      this.evalForm.markAllAsTouched();

    }
  }


}
