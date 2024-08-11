import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaDetailsComponent } from './agenda-details.component';

describe('AgendaDetailsComponent', () => {
  let component: AgendaDetailsComponent;
  let fixture: ComponentFixture<AgendaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgendaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
