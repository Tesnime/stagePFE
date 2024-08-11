import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';

import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AgendaComponent } from '../agenda/agenda.component';
import { MatListModule } from '@angular/material/list';
import { SupprimerSessionComponent } from '../supprimer-session/supprimer-session.component';
import { Session } from 'inspector';

@Component({
  selector: 'app-modif-demande',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,MatListModule,MatInputModule,MatFormFieldModule,MatDialogModule,MatButtonModule,AgendaComponent, MatChipsModule, MatIconModule,CommonModule],

  templateUrl: './modif-demande.component.html',
  styleUrl: './modif-demande.component.css'
})
export class ModifDemandeComponent {
  demande=this.data.demande;
  demandeForm!:FormGroup;
  exampleHeader = ExampleHeader;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  theme: string[] = this.demande.theme;
  sessions:any;
  session:any;
  fileName: string = 'No file chosen';
  announcer = inject(LiveAnnouncer);
  open:boolean=false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder,
    private adminService:AdminService,
    public dialog: MatDialog,
    private snackBar:MatSnackBar,
    ) {
      console.log('demande : ',this.demande)
      this.demandeForm = this.fb.group({
        doc: [this.demande.doc],
        description: [this.demande.description, Validators.required],
        titre: [this.demande.titre, Validators.required],
        theme: [this.theme],
        sessions: this.sessions
      });
    }

    ngOnInit(){
      this.adminService.sessionsBydemande(this.demande.id).subscribe(
        prof => {
          this.session = prof;
          console.log('sessions:', this.sessions);
        },
        error => {
          console.error('Error fetching demandes:', error);
          this.snackBar.open('Error fetching demandes . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );
  
    }
    add(event: MatChipInputEvent): void {
      const value = (event.value || '').trim();
      if (value) {
        this.theme.push(value);
        this.demandeForm.get('theme')?.setValue(this.theme);
      }
      event.chipInput!.clear();
    }
  
    remove(t: string): void {
      const index = this.theme.indexOf(t);
      if (index >= 0) {
        this.theme.splice(index, 1);
        this.demandeForm.get('theme')?.setValue(this.theme);
        this.announcer.announce(`Removed ${t}`);
      }
    }
  
    edit(t: string, event: MatChipEditedEvent): void {
      const value = event.value.trim();
      if (!value) {
        this.remove(t);
        return;
      }
      
  
      const index = this.theme.indexOf(t);
      if (index >= 0) {
        this.theme[index] = value;
        this.demandeForm.get('theme')?.setValue(this.theme);
      }
    }

    
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.demandeForm.get('doc')?.setValue(file);
    }
  }
  ajout(){
    if(this.open){
      this.open=false;
    }else{
        this.open=true;
      }
    
  }
  openDialog(session:any){
    const dialogRef = this.dialog.open(SupprimerSessionComponent,{
      width: '500px',
      data: { session: session} 
    });
  }
    addSession(session: any, demandeId: number) {
     
    }
    onSessionAdded(session: any) {
      this.session.push(session);
      this.open=false;
    }

    removeSession(session: any): void {
      const index = this.sessions.findIndex((s:any) => s.id === session.id);
      if (index > -1) {
        this.sessions.splice(index, 1);
  
      }
    }
    modifier(){
      if (this.demandeForm.valid) {
        this.adminService.updateDemande(this.demande.id,this.demandeForm.value).subscribe(
          (response: any) => {
            alert('Modifier avec succes');
    
            const demandeId = response.id; // Assuming response contains the ID of the saved demande
    
            // Iterate through sessions and add each session to the demande
            for (const session of this.sessions) {
              this.addSession(session, demandeId);
            }
    
            // Optionally, you might want to reload the page or refresh data
            // location.reload();
          },
          error => {
            this.snackBar.open('ajout failed, Please try again.', 'close', { duration: 5000, panelClass: 'error-snackbar' });
          }
        );
      } else {
        this.snackBar.open('Veuillez remplir tous les champs obligatoires.', 'close', { duration: 5000, panelClass: 'error-snackbar' });
      }
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