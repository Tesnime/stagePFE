import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FormateurService } from '../../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-info-per',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,MatListModule,MatInputModule,MatFormFieldModule,MatDialogModule,MatButtonModule, MatChipsModule, MatIconModule,CommonModule,MatDatepickerModule],
  templateUrl: './info-per.component.html',
  styleUrl: './info-per.component.css'
})
export class InfoPerComponent implements OnInit {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  profileForm!: FormGroup;
  profile: any;
  comTech: string[] = [];
  comp: string[] = [];
  announcer = inject(LiveAnnouncer);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private formateurService: FormateurService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formateurService.profile().subscribe(
      prof => {
        this.profile = prof;
        this.comTech = prof.comTech ;
        this.comp = prof.competance;
        console.log('comTech ',this.comTech)
        console.log('com ',this.comp)
        this.initializeForm();
      },
      error => {
        console.error('Error fetching profile:', error);
        this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      lastname: [this.profile?.lastname || '', [Validators.required]],
      firstname: [this.profile?.firstname || '', [Validators.required]],
      email: [this.profile?.email || '', [Validators.required, Validators.email]],
      bio: [this.profile?.bio || ''],
      cin: [this.profile?.cin || '', [Validators.required]],
      naissance: [this.profile?.naissance || ''],
      rib: [this.profile?.rib || ''],
      adresse: [this.profile?.adresse || ''],
      tel: [this.profile?.tel || '', [Validators.required]],
      competance: [this.comp],
      comTech: [this.comTech],
      autre: [this.profile?.autre || ''],
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.comTech.push(value);
      this.profileForm.get('comTech')?.setValue(this.comTech);
    }
    event.chipInput!.clear();
  }

  remove(t: string): void {
    const index = this.comTech.indexOf(t);
    if (index >= 0) {
      this.comTech.splice(index, 1);
      this.profileForm.get('comTech')?.setValue(this.comTech);
      this.announcer.announce(`Removed ${t}`);
    }
  }

  edit(t: string, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      this.remove(t);
      return;
    }

    const index = this.comTech.indexOf(t);
    if (index >= 0) {
      this.comTech[index] = value;
      this.profileForm.get('comTech')?.setValue(this.comTech);
    }
  }

  addC(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.comp.push(value);
      this.profileForm.get('competance')?.setValue(this.comp);
    }
    event.chipInput!.clear();
  }

  removeC(t: string): void {
    const index = this.comp.indexOf(t);
    if (index >= 0) {
      this.comp.splice(index, 1);
      this.profileForm.get('competance')?.setValue(this.comp);
      this.announcer.announce(`Removed ${t}`);
    }
  }

  editC(t: string, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      this.remove(t);
      return;
    }

    const index = this.comp.indexOf(t);
    if (index >= 0) {
      this.comp[index] = value;
      this.profileForm.get('competance')?.setValue(this.comp);
    }
  }

  addprofile(): void {
    if (this.profileForm.valid) {
      this.formateurService.addProfile(this.profileForm.value).subscribe((res) => {
        if (res.id != null) {
          this.snackBar.open('Modifié avec succès!', 'Close', { duration: 5000 });
          setTimeout(() => {
            location.reload();
          }, 3000);
        } else {
          this.snackBar.open('Erreur!', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      });
    } else {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
    }
  }
}
