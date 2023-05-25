import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingslistComponent } from './bookingslist.component';

describe('BookingslistComponent', () => {
  let component: BookingslistComponent;
  let fixture: ComponentFixture<BookingslistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingslistComponent]
    });
    fixture = TestBed.createComponent(BookingslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
