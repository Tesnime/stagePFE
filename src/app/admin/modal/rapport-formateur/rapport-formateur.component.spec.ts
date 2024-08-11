import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportFormateurComponent } from './rapport-formateur.component';

describe('RapportFormateurComponent', () => {
  let component: RapportFormateurComponent;
  let fixture: ComponentFixture<RapportFormateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapportFormateurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RapportFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
