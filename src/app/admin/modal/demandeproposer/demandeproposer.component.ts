import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { AdminService } from '../../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { NgbNavModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';
// import { ExampleHeaderComponent } from '../example-header/example-header.component';
import { Subject, takeUntil } from 'rxjs';
import { ApprenantDetailsComponent } from '../apprenant-details/apprenant-details.component';
import { AgendaComponent } from '../agenda/agenda.component';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { AddFormateurComponent } from '../add-formateur/add-formateur.component';
import { MatMenuModule } from '@angular/material/menu';
import { ModifDemandeComponent } from '../modif-demande/modif-demande.component';


@Component({
  selector: 'app-demandeproposer',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule,CommonModule,MatListModule,MatExpansionModule,MatDatepickerModule,NgbTimepickerModule,
    MatIconModule,MatFormFieldModule,MatInputModule,NgbNavModule,MatRadioModule,
    FormsModule,ReactiveFormsModule,AgendaComponent,MatChipsModule,MatMenuModule],
    providers: [provideNativeDateAdapter(),{ provide: LOCALE_ID, useValue: 'fr' }],
  templateUrl: './demandeproposer.component.html',
  styleUrl: './demandeproposer.component.css'
})
export class DemandeproposerComponent {

  gestionForm!: FormGroup ;
  acceptForm!:FormGroup;
  sessionForm!:FormGroup;
  status: string ='';
  active = 'top';
  demande:any;
  expr:any;
  formation:any;
  sessions:any[]=[];
  showAgendaa: boolean=false;
  ajout: boolean=false;
  value = '';
  exampleHeader = ExampleHeader;
agendaData: any;
fileContent!: SafeResourceUrl;
certificat:any;
responseMessage: string | null = null;
certificateId!: number;
imageUrl!: SafeUrl;
formateurImageUrls: { [key: number]: SafeUrl } = {};
selectedFormateur: number | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder,
    private router: Router,
    private adminService:AdminService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
    ) {}

  ngOnInit(): void {

    this.gestionForm=this.fb.group({
      raison: ['',Validators.required]
    });

    this.loadCertificates();
    
    this.adminService.demandeById(this.data.id).subscribe(
      dem => {
        this.demande = dem;
        this.demande.formateurPropose.forEach((formateur:any) => {
          this.loadFormateurImage(formateur.id);
          console.log("giii",this.formateurImageUrls)
        });
        
        if(this.demande.certifications.length>0){
          // console.log(this.demande.certifications[0].id)
          this.viewCertificate(this.demande.certifications[0].id);
        }  

        this.sessionForm=this.fb.group({
          nom: [this.demande.nom,Validators.required],
          lieu: ['',Validators.required],
          date: ['',Validators.required],
          debut: new FormControl(),
          fin:  new FormControl(),
    
        });
  
        // Only make subsequent requests if this.demande is defined
        if (this.demande.formateur?.id) {
          this.adminService.exprs(this.demande.formateur.id).subscribe(
            demandes => {
              this.expr = demandes;
            },
            error => {
              console.error('Error fetching demandes:', error);
              this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
            }
          );
  
          this.adminService.formations(this.demande.formateur.id).subscribe(
            demandes => {
              this.formation = demandes;
            },
            error => {
              console.error('Error fetching demandes:', error);
              this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
            }
          );
        }
      },
      error => {
        console.error('Error fetching detail:', error);
        this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );  
    
    this.adminService.sessionsBydemande(this.data.id).subscribe(
      prof => {
        this.sessions = prof;
        console.log('sessions:', this.sessions);
      },
      error => {
        console.error('Error fetching demandes:', error);
        this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );

  }

  loadFormateurImage(id: number): void {
    this.adminService.getFormateurImage(id).subscribe(
      response => {
        this.formateurImageUrls[id] = this.createImageFromBlob(response);
      },
      error => {
        console.error('Error loading image', error);
      }
    );
  }
  toggleDetails(formateurId: number): void {
    if (this.selectedFormateur === formateurId) {
      this.selectedFormateur = null; // Collapse if already selected
    } else {
      this.selectedFormateur = formateurId; // Expand the clicked formateur's details
    }
  }
  createImageFromBlob(image: Blob): SafeUrl {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(image));
  }

  loadCertificates(): void {
    this.adminService.getCertificate().subscribe(
      s => {
        this.certificat = s;
        this.cdr.markForCheck();
      },
      error => {
        this.snackBar.open('Error fetching certificates. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
  }
  openCvInNewTab(id:number): void {
    this.adminService.getCV(id).subscribe(
      (blob: Blob) => {
        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);
        
        // Open the Blob URL in a new tab
        window.open(url, '_blank');
        
        // Clean up the Blob URL
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Failed to load CV:', error);
        alert('Failed to load CV.');
      }
    );
  }
 

  // getFormateurImageUrl(id: number): SafeUrl {
  //   this.adminService.getFormateurImage(id).subscribe(
  //     response => return this.createImageFromBlob(response),
      
  //   );
  // }

  // createImageFromBlob(image: Blob): void {
      
  //   const reader = new FileReader();
  //   reader.addEventListener('load', () => {
  //      this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
  //   }, false);

  //   if (image) {
  //     reader.readAsDataURL(image);
  //   }
  // }

refus(){
  if(this.gestionForm.valid){
    this.adminService.refus(this.gestionForm.value,this.data.id).subscribe((res)=>{
      if(res.id != null){
        this.snackBar.open('envoyer avec succes!','close',{duration:5000});
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

accept(){

    this.adminService.accept(this.data.id).subscribe((res)=>{
      if(res.id != null){
        this.snackBar.open('envoyer avec succes!','close',{duration:5000});
        this.showAgendaa = true;
      }
      else{
        this.snackBar.open('Erreur!','close',{duration:5000,panelClass:'error-snackbar'});
      }
    })
  
}
ajouter(){
  this.ajout=true;
}

nbreSession(end: number): number[] {
  const sessions = [];
  for (let i = 1; i <= end; i++) {
    sessions.push(i);
  }
  return sessions;
}
openApprenant(app : any){
  const dialogRef = this.dialog.open(ApprenantDetailsComponent,{
    width:'65%',
    height:'85%',
    data: { apprenant:app} 
  });
}
ModifierDemande(){
  const dialogRef = this.dialog.open(ModifDemandeComponent,{
    width:'65%',
    height:'85%',
    data: { demande:this.demande} 
  });
}
selectedFile: File | null = null;
message: string = '';

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
  console.log(this.selectedFile)
}

openDialog(formateur:any){
  const dialogRef = this.dialog.open(AddFormateurComponent,{
    width: '500px',
    data: { demande: this.demande , formateur: formateur} 
  });
}

onUpload(): void {
  if (this.selectedFile) {
    this.adminService.upload(this.selectedFile).subscribe(
      response => {
        this.message = response;
        this.loadCertificates();
      },
      error => {
        this.message = 'Failed to upload template.';
        console.error(error);
      }
    );
  } else {
    this.message = 'Please select a file first.';
  }
}

viewCertificate(id: number): void {
  this.adminService.Certificate(id).subscribe({
    next: (blob) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const unsafeUrl = URL.createObjectURL(blob);
        this.fileContent = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
      };
      reader.readAsDataURL(blob);
    },
    error: (error) => {
      this.responseMessage = `Failed to fetch certificate content: ${error.message}`;
    }
  });
}
confirmerModele(){
  this.adminService.modifyCertificate(this.certificateId, this.data.id).subscribe(
    (response: any) => {
      // Handle the response here
      if (response === 'success') {
        this.snackBar.open('Success!', 'Close', { duration: 5000 });
      } else {
        this.snackBar.open('Error!', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    },
    (error) => {
      console.error('Error:', error);
      // Handle error here
      this.snackBar.open('modele choisie avec.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
    }
  );

}

}



@Component({
  selector: 'example-header',
  styles: `
    .example-header {
      display: flex;
      align-items: center;
      padding: 0.5em;
    }

    .example-header-label {
      flex: 1;
      height: 1em;
      font-weight: 500;
      text-align: center;
    }
  `,
  template: `
    <div class="example-header">
      <button mat-icon-button (click)="previousClicked('year')">
        <mat-icon>keyboard_double_arrow_left</mat-icon>
      </button>
      <button mat-icon-button (click)="previousClicked('month')">
        <mat-icon>keyboard_arrow_left</mat-icon>
      </button>
      <span class="example-header-label">{{periodLabel}}</span>
      <button mat-icon-button (click)="nextClicked('month')">
        <mat-icon>keyboard_arrow_right</mat-icon>
      </button>
      <button mat-icon-button (click)="nextClicked('year')">
        <mat-icon>keyboard_double_arrow_right</mat-icon>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
})
export class ExampleHeader<D> implements OnDestroy {
  private _destroyed = new Subject<void>();

  constructor(
    private _calendar: MatCalendar<D>,
    private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    cdr: ChangeDetectorRef,
  ) {
    _calendar.stateChanges.pipe(takeUntil(this._destroyed)).subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
      .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

  previousClicked(mode: 'month' | 'year') {
    this._calendar.activeDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
  }

  nextClicked(mode: 'month' | 'year') {
    this._calendar.activeDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
  }
}