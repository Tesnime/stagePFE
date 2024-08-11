import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifSessionComponent } from './modif-session.component';

describe('ModifSessionComponent', () => {
  let component: ModifSessionComponent;
  let fixture: ComponentFixture<ModifSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifSessionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
