import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewscheduleComponent } from './newschedule.component';

describe('NewscheduleComponent', () => {
  let component: NewscheduleComponent;
  let fixture: ComponentFixture<NewscheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewscheduleComponent]
    });
    fixture = TestBed.createComponent(NewscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
