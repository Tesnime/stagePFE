import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ApprenantService } from '../../Services/apprenant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddQuestionComponent } from '../modal/add-question/add-question.component';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionDetailsComponent } from '../modal/question-details/question-details.component';

@Component({
  selector: 'app-aide',
  standalone: true,
  imports: [MatButtonModule,CommonModule,MatInputModule,FormsModule, MatFormFieldModule, MatMenuModule,MatRadioModule,MatPaginatorModule,MatCardModule,MatIconModule,MatChipsModule,QuestionDetailsComponent, ReactiveFormsModule],
  templateUrl: './aide.component.html',
  styleUrl: './aide.component.css',
 
})
export class AideComponent {
  displayedQuestions: any[] = [];
  paginatedQuestions: any[] = [];
  pageSize = 5;
  currentPage = 0;
  showingAllQuestions = true;
  showingMyQuestions = false;
  myQuestions: any[] = [];
  filteredQuestions: any[] = [];
  searchTerm: string = '';
  openQuestions: boolean[] = [];
  answerForm!:FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private apprenantService: ApprenantService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    this.answerForm = this.fb.group({
      reponse: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.apprenantService.getAllQuestions().subscribe(
      questions => {
        this.displayedQuestions = questions;
        this.filteredQuestions = questions;
        this.updatePaginatedQuestions();
        console.log("questtt : "+this.displayedQuestions)
      },
      error => {
        console.error('Error fetching questions:', error);
        this.snackBar.open('Error fetching questions. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
  }

  updatePaginatedQuestions(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedQuestions = this.filteredQuestions.slice(startIndex, endIndex);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedQuestions();
  }

  envoyer(): void {
    const dialogRef = this.dialog.open(AddQuestionComponent, {
      width: '35%',
      height: '70%',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Refresh questions or handle any post-dialog actions here
    });
  }

  showMyQuestions(): void {
    this.showingAllQuestions = false;
    this.showingMyQuestions = true;
    this.apprenantService.getQuestionsByApprenantId().subscribe(
      (data) => {
        this.myQuestions = data;
        this.filteredQuestions = data; // Update the filteredQuestions to myQuestions
        this.updatePaginatedQuestions(); // Update the paginatedQuestions
      },
      (error) => {
        console.error('Error fetching my questions', error);
      }
    );
  }

  filterQuestions(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredQuestions = this.displayedQuestions.filter(question =>
      question.titre.toLowerCase().includes(searchTermLower) ||
      question.question.toLowerCase().includes(searchTermLower) ||
      question.tags.some((tag: string) => tag.toLowerCase().includes(searchTermLower))
    );
    this.updatePaginatedQuestions();
  }

  retour(): void {
    this.showingAllQuestions = true;
    this.showingMyQuestions = false;
    this.updatePaginatedQuestions();
  }
  toggleAnswer(index: number): void {
    this.openQuestions[index] = !this.openQuestions[index];
  }
  answerQ(question:any){
      if (this.answerForm.valid) {
      this.apprenantService.addAnswer(this.answerForm.value, question.id).subscribe(
        (response: any) => {
          // this.snackBar.open('Envoyer avec succès!', 'close', { duration: 5000 });
          // Add the new answer to the specific question's answers array
          question.answers.push(response);
          this.answerForm.reset();
        },
        error => {
          this.snackBar.open('Ajout échoué, veuillez réessayer.', 'close', { duration: 5000, panelClass: 'error-snackbar' });
        }
      );
    } else {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires.', 'close', { duration: 5000, panelClass: 'error-snackbar' });
    }
  }
  
}
