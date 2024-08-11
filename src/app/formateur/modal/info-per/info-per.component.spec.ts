import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPerComponent } from './info-per.component';

describe('InfoPerComponent', () => {
  let component: InfoPerComponent;
  let fixture: ComponentFixture<InfoPerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoPerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoPerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
