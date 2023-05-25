import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverPassComponent } from './recover-pass.component';

describe('RecoverPassComponent', () => {
  let component: RecoverPassComponent;
  let fixture: ComponentFixture<RecoverPassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecoverPassComponent]
    });
    fixture = TestBed.createComponent(RecoverPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
