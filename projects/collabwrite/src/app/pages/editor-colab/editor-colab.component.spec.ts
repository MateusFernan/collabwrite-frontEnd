import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorColabComponent } from './editor-colab.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('EditorColabComponent', () => {
  let component: EditorColabComponent;
  let fixture: ComponentFixture<EditorColabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditorColabComponent,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorColabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
