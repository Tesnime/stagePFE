import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeForComponent } from './home-for.component';

describe('HomeForComponent', () => {
  let component: HomeForComponent;
  let fixture: ComponentFixture<HomeForComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeForComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
