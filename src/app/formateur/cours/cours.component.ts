import { Component, OnInit, TemplateRef, inject } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CourseComponent } from '../modal/course/course.component';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { FormateurService } from '../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../navs/nav/nav.component';
import { NavbarComponent } from '../navs/navbar/navbar.component';


@Component({
  selector: 'app-cours',
  standalone: true,
  imports: [NavComponent,NavbarComponent,MatIconModule,CourseComponent,CommonModule],
  templateUrl: './cours.component.html',
  styleUrl: './cours.component.css'
})
export class CoursComponent implements OnInit {

  // cours:any;
  // constructor(private router: Router,
  //   private fb:FormBuilder,
  //   private formateurService:FormateurService,
  //   private snackBar:MatSnackBar) {}

  ngOnInit(): void {

    // this.formateurService.cours().subscribe(
    //   prof => {
    //     this.cours = prof;
    //     console.log('profile:', this.cours);
    //   },
    //   error => {
    //     console.error('Error fetching profile:', error);
    //     this.snackBar.open('Error fetching cours . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
    //   }
    // );
  }
  
  

  private modalService = inject(NgbModal);
  openVerticallyCentered(content: TemplateRef<any>) {
		this.modalService.open(content, { centered: true });
	}

}
