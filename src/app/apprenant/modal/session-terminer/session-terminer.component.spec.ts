import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTerminerComponent } from './session-terminer.component';

describe('SessionTerminerComponent', () => {
  let component: SessionTerminerComponent;
  let fixture: ComponentFixture<SessionTerminerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionTerminerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessionTerminerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
