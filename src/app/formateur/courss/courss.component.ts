import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { NavbarComponent } from '../navs/navbar/navbar.component';
import { NavComponent } from '../navs/nav/nav.component';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormateurService } from '../../Services/formateur.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CoursesComponent } from '../modal/courses/courses.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';



@Component({
  selector: 'app-courss',
  standalone: true,
  imports: [NavbarComponent,NavComponent,MatIconModule,CommonModule,CoursesComponent,MatCardModule , MatButtonModule,MatListModule],
  templateUrl: './courss.component.html',
  styleUrl: './courss.component.css'
})
export class CourssComponent implements OnInit {
  cours:any;

  constructor(private router: Router,
    private formateurService:FormateurService,
    private snackBar:MatSnackBar) {}
  ngOnInit(): void {
    this.formateurService.cours().subscribe(
      prof => {
        this.cours = prof;
        console.log('profile:', this.cours);
      },
      error => {
        console.error('Error fetching profile:', error);
        this.snackBar.open('Error fetching cours . Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
  }
    private modalService = inject(NgbModal);
    openVerticallyCentered(content: TemplateRef<any>) {
		this.modalService.open(content, { centered: true });
	}


}
