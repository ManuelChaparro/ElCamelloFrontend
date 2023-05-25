import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocklistComponent } from './stocklist.component';

describe('StocklistComponent', () => {
  let component: StocklistComponent;
  let fixture: ComponentFixture<StocklistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StocklistComponent]
    });
    fixture = TestBed.createComponent(StocklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
