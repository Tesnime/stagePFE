import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';
import { ApprenantDetailsComponent } from '../apprenant-details/apprenant-details.component';
import { AgendaComponent } from '../agenda/agenda.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-demande-details',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, MatListModule, MatExpansionModule, MatDatepickerModule, NgbTimepickerModule,
    MatIconModule, MatFormFieldModule, MatInputModule, NgbNavModule,
    FormsModule, ReactiveFormsModule, AgendaComponent, MatRadioModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './demande-details.component.html',
  styleUrls: ['./demande-details.component.css']
})
export class DemandeDetailsComponent implements OnInit, OnDestroy {
  gestionForm!: FormGroup;
  certificateId!: number;
  acceptForm!: FormGroup;
  sessionForm!: FormGroup;
  status: string = '';
  active = 'top';
  demande: any;
  expr: any;
  formation: any;
  sessions: any;
  showAgendaa: boolean = false;
  ajout: boolean = false;
  value = '';
  exampleHeader = ExampleHeader;
  agendaData: any;
  fileContent!: SafeResourceUrl;
  certificat: any[] = [];
  responseMessage: string | null = null;
  selectedFile: File | null = null;
  message: string = '';
  

  private _destroyed = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.gestionForm = this.fb.group({
      raison: ['', Validators.required]
    });

    this.loadCertificates();

    this.adminService.demandeById(this.data.id).subscribe(
      dem => {
        this.demande = dem;
        if (this.demande.certifications.length > 0) {
          this.viewCertificate(this.demande.certifications[0].id);
        }
        this.sessionForm = this.fb.group({
          nom: [this.demande.nom, Validators.required],
          lieu: ['', Validators.required],
          date: ['', Validators.required],
          debut: new FormControl(),
          fin: new FormControl(),
        });

        if (this.demande?.formateur?.id) {
          this.adminService.exprs(this.demande.formateur.id).subscribe(
            demandes => {
              this.expr = demandes;
            },
            error => {
              this.snackBar.open('Error fetching demandes. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
            }
          );

          this.adminService.formations(this.demande.formateur.id).subscribe(
            demandes => {
              this.formation = demandes;
            },
            error => {
              this.snackBar.open('Error fetching demandes. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
            }
          );
        }
      },
      error => {
        this.snackBar.open('Error fetching details. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );

    this.adminService.sessionsBydemande(this.data.id).subscribe(
      prof => {
        this.sessions = prof;
      },
      error => {
        this.snackBar.open('Error fetching demandes. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
  }


  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
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
 

  refus() {
    if (this.gestionForm.valid) {
      this.adminService.refus(this.gestionForm.value, this.data.id).subscribe((res) => {
        if (res.id != null) {
          this.snackBar.open('Sent successfully!', 'Close', { duration: 5000 });
          setTimeout(() => {
            location.reload();
          }, 3000);
        } else {
          this.snackBar.open('Error!', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      });
    } else {
      this.snackBar.open('Please fill out all required fields.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
    }
  }

  accept() {
    this.adminService.accept(this.data.id).subscribe((res) => {
      if (res.id != null) {
        this.snackBar.open('Sent successfully!', 'Close', { duration: 5000 });
        this.showAgendaa = true;
      } else {
        this.snackBar.open('Error!', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    });
  }

  confirmerModele() {
    this.adminService.modifyCertificate(this.certificateId, this.data.id).subscribe(
      (response: any) => {
        if (response === 'success') {
          this.snackBar.open('Success!', 'Close', { duration: 5000 });
        } else {
          this.snackBar.open('Error!', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      },
      (error) => {
        this.snackBar.open('Template chosen successfully.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
  }

  ajouter() {
    this.ajout = true;
  }

  nbreSession(end: number): number[] {
    const sessions = [];
    for (let i = 1; i <= end; i++) {
      sessions.push(i);
    }
    return sessions;
  }

  openApprenant(app: any) {
    this.dialog.open(ApprenantDetailsComponent, {
      width: '65%',
      height: '85%',
      data: { apprenant: app }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
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
  openCvInNewTab(): void {
    this.adminService.getCV(this.demande.formateur.id).subscribe(
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
      <span class="example-header-label">{{ periodLabel }}</span>
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
