import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeApComponent } from './home-ap.component';

describe('HomeApComponent', () => {
  let component: HomeApComponent;
  let fixture: ComponentFixture<HomeApComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeApComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeApComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
