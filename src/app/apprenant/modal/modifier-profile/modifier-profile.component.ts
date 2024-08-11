import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher, provideNativeDateAdapter } from '@angular/material/core';
import { ApprenantService } from '../../../Services/apprenant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-modifier-profile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule , MatInputModule, MatFormFieldModule, CommonModule, MatDialogModule,MatButtonModule,MatDatepickerModule], 
  providers: [provideNativeDateAdapter()],
  templateUrl: './modifier-profile.component.html',
  styleUrl: './modifier-profile.component.css'
})
export class ModifierProfileComponent {
  editForm!: FormGroup ;
  selectedFile!: File;
  imageUrl!: SafeUrl;
 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder,
    private apprenantService:ApprenantService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
    ) {}


    profile=this.data.profile;
    ngOnInit(): void {
      console.log("profile "+this.profile)
      this.editForm=this.fb.group({
        firstname: [this.profile.firstname,Validators.required],
        lastname: [this.profile.lastname,Validators.required],
        email: [this.profile.email,[Validators.required, Validators.email]],
        cin: [this.profile.cin,Validators.required],
        naissance: [this.profile.naissance,Validators.required],
        tel: [this.profile.tel,Validators.required],
        telFix: [this.profile.telFix,Validators.required],
        societe: [this.profile.societe,Validators.required],
        adrress: [this.profile.adrress,Validators.required],
      });

      this.apprenantService.getImage().subscribe(
        response => this.createImageFromBlob(response),
        error => console.error(error)
      );
    }

  matcher = new MyErrorStateMatcher();

  
  createImageFromBlob(image: Blob): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  addprofile():void{
    if(this.editForm.valid){
      this.apprenantService.addProfile(this.editForm.value).subscribe((res)=>{
        if(res.id != null){
          this.snackBar.open('modifie avec succes!','close',{duration:5000});
          // this.router.navigateByUrl('formateur/home');
          setTimeout(() => {
            location.reload();
          }, 3000);
        }
        else{
          this.snackBar.open('Erreur!','close',{duration:5000,panelClass:'error-snackbar'});
        }
      })
    }else{
      this.snackBar.open('Veuillez remplir tous les champs obligatoires.','close',{duration:5000,panelClass:'error-snackbar'});

    }
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.onSubmit();
    location.reload();

  }
  onSubmit(): void {
    if(this.selectedFile){
      this.apprenantService.uploadImage(this.selectedFile).subscribe(
        response => {
          console.log(response)
          setTimeout(() => {
            location.reload();
          }, 3000);
        },
        error => console.error(error)
        
      );
  }
  else {
    console.log('Please select a file first.');
  }

}
} 