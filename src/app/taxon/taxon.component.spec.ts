import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonComponent } from './taxon.component';

describe('TaxonComponent', () => {
  let component: TaxonComponent;
  let fixture: ComponentFixture<TaxonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaxonComponent]
    });
    fixture = TestBed.createComponent(TaxonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
