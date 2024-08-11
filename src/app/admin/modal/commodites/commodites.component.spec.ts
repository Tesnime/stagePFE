import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoditesComponent } from './commodites.component';

describe('CommoditesComponent', () => {
  let component: CommoditesComponent;
  let fixture: ComponentFixture<CommoditesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommoditesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommoditesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
