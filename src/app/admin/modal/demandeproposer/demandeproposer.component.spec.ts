import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeproposerComponent } from './demandeproposer.component';

describe('DemandeproposerComponent', () => {
  let component: DemandeproposerComponent;
  let fixture: ComponentFixture<DemandeproposerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeproposerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandeproposerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
