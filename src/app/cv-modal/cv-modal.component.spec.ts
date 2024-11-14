import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvModalComponent } from './cv-modal.component';

describe('CvModalComponent', () => {
  let component: CvModalComponent;
  let fixture: ComponentFixture<CvModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CvModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
