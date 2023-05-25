import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampuslistComponent } from './campuslist.component';

describe('CampuslistComponent', () => {
  let component: CampuslistComponent;
  let fixture: ComponentFixture<CampuslistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampuslistComponent]
    });
    fixture = TestBed.createComponent(CampuslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
