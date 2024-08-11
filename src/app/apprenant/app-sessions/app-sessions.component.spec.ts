import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSessionsComponent } from './app-sessions.component';

describe('AppSessionsComponent', () => {
  let component: AppSessionsComponent;
  let fixture: ComponentFixture<AppSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSessionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
