import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDocumentsComponent } from './generic-documents.component';

describe('GenericDocumentsComponent', () => {
  let component: GenericDocumentsComponent;
  let fixture: ComponentFixture<GenericDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
