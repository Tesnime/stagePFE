import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navs/navbar/navbar.component';
import { NavComponent } from '../navs/nav/nav.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormateurService } from '../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { ConvertToPdfComponent } from '../../formateur/components/convert-to-pdf/convert-to-pdf.component';


@Component({
  selector: 'app-eval',
  standalone: true,
  imports: [NavbarComponent,NavComponent,FormsModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,CommonModule],
  templateUrl: './eval.component.html',
  styleUrl: './eval.component.css'
})
export class EvalComponent implements OnInit {
  
  evalForm!:FormGroup;
  session:any;
  receivedData:any;

  constructor( private route: ActivatedRoute,
    private router: Router,
    private fb:FormBuilder,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar) {}
 


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.receivedData = params['key'];
      // Use receivedData as needed
      console.log(this.receivedData);
    });
    this.formateurService.session(this.receivedData).subscribe(
      prof => {
        this.session = prof;
        console.log('session:', this.session);
      },
      error => {
        console.error('Error fetching detail:', error);
        this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
    this.evalForm=this.fb.group({
      q1: [''],
      q2: [''],
      q3: [''],
      q4: [''],
      q5: [''],
      
    });
  }
  onSubmit():void{
   
  
    if(this.evalForm.valid){
      this.formateurService.evaluation(this.evalForm.value,this.receivedData).subscribe((res)=>{
        if(res.id != null){
          alert('envoyer avec succes!');
          this.router.navigateByUrl('formateur/home');
        }
        else{
          this.snackBar.open('vous avez deja envoyer votre reponse.','close',{duration:5000,panelClass:'error-snackbar'});
        }
      })
    }else{
      this.evalForm.markAllAsTouched();
    }
  }
  

}
