import { CommonModule, Time } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modif-session',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, CommonModule, MatDialogModule, MatButtonModule,MatDatepickerModule,NgbTimepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './modif-session.component.html',
  styleUrl: './modif-session.component.css'
})
export class ModifSessionComponent {
  sessionForm!:FormGroup;
  exampleHeader = ExampleHeader;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder,
    private adminService:AdminService,
    private snackBar:MatSnackBar,
    ) {
      
    }

    session =this.data.session;
    deb={hour: Number(this.session.debut.split(":")[0]) , minute: Number(this.session.debut.split(":")[1])};
    finn={hour:Number(this.session.fin.split(":")[0]), minute: Number(this.session.fin.split(":")[1])};
    
   

    ngOnInit(): void {
      this.sessionForm=this.fb.group({
        date: [this.session.date,Validators.required],
        debut:[this.deb],
        fin:  this.finn,
  
      });
    }
    modifier(){
      let debut=this.sessionForm.get('debut')!.value.hour+':'+this.sessionForm.get('debut')!.value.minute+':00';
      let fin=this.sessionForm.get('fin')!.value.hour+':'+this.sessionForm.get('fin')!.value.minute+':00';
      this.sessionForm.get('debut')!.setValue(debut);
      this.sessionForm.get('fin')!.setValue(fin);
      console.log(this.sessionForm.value)
      if(this.sessionForm.valid){
        this.adminService.updateSession(this.sessionForm.value,this.session.id).subscribe((res)=>{
          if(res.id != null){
            this.snackBar.open('envoyer avec succes!','close',{duration:5000});
          }
          else{
            this.snackBar.open('Erreur!','close',{duration:5000,panelClass:'error-snackbar'});
          }
        })
      }else{
        this.snackBar.open('Veuillez remplir tous les champs obligatoires.','close',{duration:5000,panelClass:'error-snackbar'});

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