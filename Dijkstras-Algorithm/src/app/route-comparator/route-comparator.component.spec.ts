import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteComparatorComponent } from './route-comparator.component';

describe('RouteComparatorComponent', () => {
  let component: RouteComparatorComponent;
  let fixture: ComponentFixture<RouteComparatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteComparatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteComparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
