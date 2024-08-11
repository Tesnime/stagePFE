import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { AdminService } from '../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rapport',
  standalone: true,
  imports: [MatTabsModule, FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,],
  templateUrl: './rapport.component.html',
  styleUrl: './rapport.component.css'
})
export class RapportComponent {
  demandes:any;
  formateurs:any;
  myControl = new FormControl('');
  filteredOptions: Observable<string[]> | undefined;
  filteredOptions1: Observable<string[]> | undefined;

  constructor(private adminService:AdminService,
    private snackBar:MatSnackBar,
    private router: Router,
    ){
  }
  ngOnInit() {
    

    this.adminService.demandesTerminer().subscribe(
      demandes => {
        this.demandes = demandes;
        console.log(demandes)
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
        );
      },
      error => {
        console.error('Error fetching demandes:', error);
        this.snackBar.open('Error fetching demandes. Please try again.', 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    );

    this.adminService.formateurs().subscribe(
      formateur => {
        this.formateurs = formateur;
        // console.log(formateur)
        this.filteredOptions1 = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter1(value || '')),
        );
      },
      error => {
        console.error('Error fetching demandes:', error);
        this.snackBar.open('Error fetching demandes. Please try again.', 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    );
    
  }


  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedOption = event.option.value;
    const selectedDemande = this.demandes.find(
      (demande: any) =>
        `${demande.titre} (${demande.formateur.firstname} ${demande.formateur.lastname})` ===
        selectedOption
    );
    if (selectedDemande) {
      this.redirectToPage(selectedDemande);
    }
    
  }
  private redirectToPage(demande: any): void {
    // console.log("envoyer "+JSON.stringify(demande))
    this.router.navigate(['admin/rapport'], { queryParams: { demande: JSON.stringify(demande) } });
  }

  onOptionSelectedFormateur(event: MatAutocompleteSelectedEvent): void {
    const selectedOption = event.option.value;
    const selectedFormsteur = this.formateurs.find(
      (demande: any) =>
        `${demande.firstname} ${demande.lastname}` ===
        selectedOption
    );
    console.log(selectedFormsteur)
    if (selectedFormsteur) {
      this.redirectToPage1(selectedFormsteur);
    }
    
  }
  private redirectToPage1(formateur: any): void {
    // console.log("envoyer "+JSON.stringify(demande))
    this.router.navigate(['admin/rapportFormateur'], { queryParams: { formateur: JSON.stringify(formateur) } });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    const filteredDemandes = this.demandes.filter((demande: any) =>
      `${demande.titre} (${demande.formateur.firstname} ${demande.formateur.lastname})`
        .toLowerCase()
        .includes(filterValue)
    );

    return filteredDemandes.map(
      (demande: any) =>
        `${demande.titre} (${demande.formateur.firstname} ${demande.formateur.lastname})`
    );
  }


  // private _filter(value: string): any[] {
  //   const filterValue = value.toLowerCase();
  //   return this.demandes.map((demande: any) => demande.titre+' ('+demande.formateur.firstname+" "+demande.formateur.firstname+")").filter((name: string) => name.toLowerCase().includes(filterValue));
  // }

  
  private _filter1(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.formateurs.map((formateur: any) => formateur.firstname + " " + formateur.lastname).filter((name: string) => name.toLowerCase().includes(filterValue));
  }
}
