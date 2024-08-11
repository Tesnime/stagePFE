import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeAccComponent } from './demande-acc.component';

describe('DemandeAccComponent', () => {
  let component: DemandeAccComponent;
  let fixture: ComponentFixture<DemandeAccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeAccComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandeAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
