import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExprComponent } from './edit-expr.component';

describe('EditExprComponent', () => {
  let component: EditExprComponent;
  let fixture: ComponentFixture<EditExprComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExprComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditExprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
