import { Component, ViewChild } from '@angular/core';
import { ApprenantService } from '../../Services/apprenant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ModifierProfileComponent } from '../modal/modifier-profile/modifier-profile.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { SessionTerminerComponent } from '../modal/session-terminer/session-terminer.component';

@Component({
  selector: 'app-mon-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule,MatDividerModule,MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,
  ],
  templateUrl: './mon-profile.component.html',
  styleUrl: './mon-profile.component.css'
})
export class MonProfileComponent {
  profile:any;
  displayedColumns: string[] = ['attestation'];
  dataSource = new MatTableDataSource<any>();
  fileContent!: SafeResourceUrl;
  responseMessage: string | null = null;
  selectedFile!: File;
  imageUrl!: SafeUrl;
  demandes:any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apprenantService:ApprenantService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog,
    private router:Router,
    private sanitizer: DomSanitizer) {}
    
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

  ngOnInit(): void {

    this.apprenantService.getImage().subscribe(
      response => this.createImageFromBlob(response),
      error => console.error(error)
    );

    this.apprenantService.getProfile().subscribe(
      prof => {
        this.profile = prof;
        
        if (this.profile && this.profile.certifications) {
          this.dataSource.data = this.profile.certifications;
        }
      },
      error => {
        console.error('Error fetching profile:', error);
        this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );

    this.apprenantService.demandeByApp().subscribe(
      prof => {
        this.demandes = prof;
      },
      error => {
        console.error('Error fetching profile:', error);
        this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );

    
  }

  createImageFromBlob(image: Blob): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  edit() {
    const dialogRef = this.dialog.open(ModifierProfileComponent,{
      width:'70%',
      height:'85%',
      data: { profile : this.profile} 
    });
  }
  viewCertif(id: number): void {
    this.apprenantService.Certificate(id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (error) => {
        this.responseMessage = `Failed to fetch certificate content: ${error.message}`;
      }
    });
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.onSubmit();
    location.reload();

  }
  onSubmit(): void {
    if(this.selectedFile){
      this.apprenantService.uploadImage(this.selectedFile).subscribe(
        response => console.log(response),
        error => console.error(error)
      );
  }
  else {
    console.log('Please select a file first.');
  }
 
}
openDetails(demande:any) {
  const dialogRef = this.dialog.open(SessionTerminerComponent,{
    width:'70%',
    height:'90%',
    data: { demande : demande} 
  });
}

}
