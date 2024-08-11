import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificationDesSessionsComponent } from './planification-des-sessions.component';

describe('PlanificationDesSessionsComponent', () => {
  let component: PlanificationDesSessionsComponent;
  let fixture: ComponentFixture<PlanificationDesSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanificationDesSessionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlanificationDesSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
