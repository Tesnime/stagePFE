import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourssComponent } from './courss.component';

describe('CourssComponent', () => {
  let component: CourssComponent;
  let fixture: ComponentFixture<CourssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourssComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
