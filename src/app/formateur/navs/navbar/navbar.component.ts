import { Component, Input, OnInit } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { UserStorageService } from '../../../Services/storage/user-storage.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { FormateurService } from '../../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-navbar',
  standalone:true,
  imports:[NgbDropdownModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  profile:any;
  constructor(private router: Router,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar) {}


  ngOnInit(): void {
    this.formateurService.profile().subscribe(
      prof => {
        this.profile = prof;
        console.log('profile:', this.profile);
      },
      error => {
        console.error('Error fetching profile:', error);
        this.snackBar.open('Error fetching profile. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
  }
  
  logout(){
    UserStorageService.SignOut();
    this.router.navigateByUrl('');
  }

  collapsed = true;
  
}
