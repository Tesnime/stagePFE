import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ApprenantService } from '../../../Services/apprenant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule , MatInputModule, MatFormFieldModule, CommonModule, MatDialogModule,MatButtonModule,MatChipsModule,MatIconModule],
  templateUrl: './add-question.component.html',
  styleUrl: './add-question.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddQuestionComponent {
  questForm: FormGroup;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  theme: string[] = [];
  announcer = inject(LiveAnnouncer);

  constructor(
    private fb: FormBuilder,
    private apprenantService: ApprenantService,
    private snackBar: MatSnackBar
  ) {
    this.questForm = this.fb.group({
      titre: ['', Validators.required],
      question: ['', Validators.required],
      tags: [this.theme]
    });
  }

  remove(t: string): void {
    const index = this.theme.indexOf(t);
    if (index >= 0) {
      this.theme.splice(index, 1);
      this.questForm.get('theme')?.setValue([...this.theme]); // Update the form value
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
      this.questForm.get('theme')?.setValue([...this.theme]); // Update the form value
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.theme.push(value);
      this.questForm.get('theme')?.setValue([...this.theme]); // Update the form value
    }
    event.chipInput!.clear();
  }
  addQuest(){
    console.log(this.questForm.value)
    if (this.questForm.valid) {
      this.apprenantService.addQuestion(this.questForm.value).subscribe(
        (response: any) => {
          this.snackBar.open('envoyer avec succes!', 'close', { duration: 5000 });
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
