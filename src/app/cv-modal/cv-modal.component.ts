import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { FormateurService } from '../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cv-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    CommonModule,
    MatDatepickerModule,
  ],
  templateUrl: './cv-modal.component.html',
  styleUrls: ['./cv-modal.component.css'], // Corrected from styleUrl to styleUrls
})
export class CvModalComponent {
  fileURL: string | null = null;
  fileType: string = '';
  profileForm!: FormGroup;
  detailsCV: any = {}; // Initialize as an empty object
  profile: any; // Declare profile as any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { cv: File; formateur: any },
    private router: Router,
    private fb: FormBuilder,
    private formateurService: FormateurService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const file = this.data.cv; // Use the CV file passed in data
    this.profile = this.data.formateur; // Initialize profile from data

    if (file) {
      this.fileType = file.type;

      // Convert file to a URL for display
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fileURL = e.target.result;
      };
      reader.readAsDataURL(file);

      this.uploadCV(file); // Call the method to upload the CV
      this.initializeForm(); // Initialize the form after uploading the CV
    } else {
      this.snackBar.open('No file provided for preview.', 'Close', { duration: 5000 });
    }
  }

  private uploadCV(file: File): void {
    this.formateurService.upload_CV(file).subscribe(
      (prof) => {
        this.detailsCV = prof; // Assign the received profile data
  
        // Format the fields to have each item on a new line if they are arrays
        const formattedSkills = this.detailsCV.skills ? this.detailsCV.skills.join('\n') : '';
        const formattedExperience = this.detailsCV.experience ? this.detailsCV.experience.join('\n') : '';
        const formattedEducation = this.detailsCV.education ? this.detailsCV.education.join('\n') : '';
  
        // Convert formattedSkills to an array (removing bullet points and extra spaces)
        const competance: string[] = formattedSkills
          .split('\n') // Split by line breaks
          .map((skill: any) => skill.trim().replace(/•/g, '').trim()) // Remove bullet points and extra spaces
          .filter((skill: any) => skill.length > 0); // Remove empty entries
  
        this.profileForm.patchValue({
          email: this.detailsCV.email || '', // Set email value if it exists
          adresse: this.detailsCV.address || '', // Set address value if it exists
          bio: this.detailsCV.profile || '', // Set bio value if it exists
          competance: competance, // Set competance value as an array
          experience: formattedExperience, // Set experience value, each item on a new line
          education: formattedEducation, // Set formation value, each item on a new line
        });
      },
      (error) => {
        console.error('Error fetching profile:', error);
        this.snackBar.open('Error fetching profile. Please try again.', 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar',
        });
      }
    );
  }
  

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.formateurService.updateCV(this.profileForm.value).subscribe((res) => {
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

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      lastname: [this.profile?.lastname || '', [Validators.required]], // Use optional chaining
      firstname: [this.profile?.firstname || '', [Validators.required]], // Use optional chaining
      email: [this.detailsCV.email, [Validators.required, Validators.email]], // Initial value set to empty string
      bio: [this.detailsCV.profile], // Initial value set to empty string
      cin: ['', [Validators.required]],
      naissance: [''],
      rib: [''],
      adresse: [this.detailsCV.adress, [Validators.required]], // Require address
      tel: ['', [Validators.required]],
      autre: [''],
      competance: [this.detailsCV?.skills || ''], // Check if detailsCV is defined
      experience: [this.detailsCV?.experience || ''], // Check if detailsCV is defined
      education: [this.detailsCV?.education || ''],
    });
  }
}
