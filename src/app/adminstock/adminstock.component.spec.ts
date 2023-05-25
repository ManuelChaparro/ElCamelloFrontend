import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminstockComponent } from './adminstock.component';

describe('AdminstockComponent', () => {
  let component: AdminstockComponent;
  let fixture: ComponentFixture<AdminstockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminstockComponent]
    });
    fixture = TestBed.createComponent(AdminstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
