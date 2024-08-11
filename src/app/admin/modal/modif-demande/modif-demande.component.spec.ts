import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifDemandeComponent } from './modif-demande.component';

describe('ModifDemandeComponent', () => {
  let component: ModifDemandeComponent;
  let fixture: ComponentFixture<ModifDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifDemandeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
