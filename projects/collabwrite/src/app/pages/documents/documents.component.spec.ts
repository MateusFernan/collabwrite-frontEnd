import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsComponent } from './documents.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DocumentsService } from '../../core/services/documents.service';
import { DocumentDto } from '../../models/documents.dto';
import { environment } from '../../../environments/environment';

describe('DocumentsComponent', () => {
  let httpMock: HttpTestingController;
  let component: DocumentsComponent;
  let fixture: ComponentFixture<DocumentsComponent>;
  const base = environment.apiUrl + '/documents';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsComponent, HttpClientTestingModule],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
