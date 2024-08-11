import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupprimerSessionComponent } from './supprimer-session.component';

describe('SupprimerSessionComponent', () => {
  let component: SupprimerSessionComponent;
  let fixture: ComponentFixture<SupprimerSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupprimerSessionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupprimerSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
