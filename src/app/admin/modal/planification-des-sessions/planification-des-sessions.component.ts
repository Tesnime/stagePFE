import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { AgendaComponent } from '../agenda/agenda.component';
import { AdminService } from '../../../Services/admin.service';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-planification-des-sessions',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,MatListModule,MatInputModule,MatFormFieldModule,MatDialogModule,MatButtonModule,AgendaComponent, MatChipsModule, MatIconModule,CommonModule],
  templateUrl: './planification-des-sessions.component.html',
  styleUrl: './planification-des-sessions.component.css'
})
export class PlanificationDesSessionsComponent {
  sessions:any;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  theme: string[] = [];
  demandeForm: FormGroup;
  fileName: string = 'No file chosen';

  announcer = inject(LiveAnnouncer);

  constructor(private fb: FormBuilder,
    private adminService:AdminService,
    private snackBar:MatSnackBar
  ) {
    this.demandeForm = this.fb.group({
      doc: [''],
      description: ['', Validators.required],
      titre: ['', Validators.required],
      theme: [this.theme],
      sessions: this.sessions
    });
  }

  ngOnInit(): void {
    this.adminService.sessions$.subscribe(sessions => {
      this.sessions = sessions;
    });
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

  removeSession(session: any): void {
    const index = this.sessions.findIndex((s:any) => s.id === session.id);
    if (index > -1) {
      this.sessions.splice(index, 1);

    }
  }

  proposer() {
    this.demandeForm.get('sessions')?.setValue(this.sessions);
  
    if (this.demandeForm.valid) {
      this.adminService.proposerFormation(this.demandeForm.value).subscribe(
        (response: any) => {
          this.snackBar.open('envoyer avec succes!', 'close', { duration: 5000 });
  
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
  
  addSession(session: any, demandeId: number) {
    this.adminService.addSession(session, demandeId).subscribe(
      (res: any) => {
        if (res.id) {
          console.log('Session ajoutée avec succès:', res);
          // Optionally, you can notify the user here
          // this.snackBar.open('Session ajoutée avec succès!', 'close', { duration: 5000 });
        } else {
          console.error('Erreur lors de l\'ajout de la session:', res);
          this.snackBar.open('Erreur lors de l\'ajout de la session.', 'close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      },
      error => {
        console.error('Erreur lors de l\'ajout de la session:', error);
        this.snackBar.open('Erreur lors de l\'ajout de la session.', 'close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
  }
  


}
