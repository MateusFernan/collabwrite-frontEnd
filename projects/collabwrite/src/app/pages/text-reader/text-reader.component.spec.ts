import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextReaderComponent } from './text-reader.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('TextReaderComponent', () => {
  let component: TextReaderComponent;
  let fixture: ComponentFixture<TextReaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextReaderComponent, HttpClientModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TextReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
