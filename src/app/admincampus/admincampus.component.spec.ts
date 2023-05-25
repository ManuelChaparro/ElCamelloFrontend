import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmincampusComponent } from './admincampus.component';

describe('AdmincampusComponent', () => {
  let component: AdmincampusComponent;
  let fixture: ComponentFixture<AdmincampusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmincampusComponent]
    });
    fixture = TestBed.createComponent(AdmincampusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
