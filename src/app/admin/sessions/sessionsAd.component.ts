import { Component, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminService } from '../../Services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { SessionDetailsComponent } from '../modal/session-details/session-details.component';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DemandeAccComponent } from '../modal/demande-acc/demande-acc.component';

@Component({
  selector: 'app-sessionsAd',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule,MatIconModule,CommonModule,MatButtonModule, MatTableModule,MatMenuModule,
    MatPaginatorModule],
    animations: [
      trigger('detailExpand', [
        state('collapsed', style({ height: '0px', display: 'none', minHeight: '0' })),
        state('expanded', style({ height: '*', display: 'block' })),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css'
})
export class SessionsAdComponent {
  sessions: any[] = [];
  displayedColumns: string[] = ['number', 'demande', 'formateur', 'theme', 'nombre des jours', 'expand','actions'];
  dataSource: MatTableDataSource<any>;
  expandedElement: any | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.adminService.getDemandeSession().subscribe(
      sessions => {
        this.sessions = sessions;
        this.dataSource.data = this.sessions;
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const demandeTitle = data.demande.titre.toLowerCase().includes(filter);
          const formateurName = data.demande.formateur ? 
            `${data.demande.formateur.firstname.toLowerCase()} ${data.demande.formateur.lastname.toLowerCase()}`.includes(filter) : false;
          const themeMatch = data.demande.theme.some((theme: string) => theme.toLowerCase().includes(filter));
          
          return demandeTitle || formateurName || themeMatch;
        };
      },
      error => {
        console.error('Error fetching sessions:', error);
        this.snackBar.open('Error fetching sessions. Please try again.', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getFormateurName(session: any): string {
    return session.demande.formateur ?
      `${session.demande.formateur.firstname} ${session.demande.formateur.lastname}` :
      'Sans formateur';
  }

  applyFilter(value: string): void {
    const filterValue = value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const demandeTitle = data.demande.titre.toLowerCase().includes(filter);
      const formateurName = data.demande.formateur ? 
        `${data.demande.formateur.firstname.toLowerCase()} ${data.demande.formateur.lastname.toLowerCase()}`.includes(filter) : false;
      const themeMatch = data.demande.theme.some((theme: string) => theme.toLowerCase().includes(filter));
      
      return demandeTitle || formateurName || themeMatch;
    };
    this.dataSource.filter = filterValue;
  }

  toggleExpand(element: any): void {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  open(ite: any) {
    const dialogRef = this.dialog.open(SessionDetailsComponent, {
      width: '65%',
      height: '85%',
      data: { id: ite.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDemande(ite: any) {
    console.log("demmmm  "+JSON.stringify(ite.demande) )
    const dialogRef = this.dialog.open(DemandeAccComponent, {
      width:'75%',
      height:'90%',
      data: { demande: ite.demande }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  
}
