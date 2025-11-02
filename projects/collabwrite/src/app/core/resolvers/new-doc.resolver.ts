import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DocumentsService } from '../services/documents.service';
import { DocumentDto } from '../../models/documents.dto';

@Injectable({ providedIn: 'root' })
export class NewDocResolver implements Resolve<DocumentDto> {
  constructor(private docs: DocumentsService) {}

  resolve(): Observable<DocumentDto> {
    return this.docs.create({
      title: 'Sem título',
      visibility: 'PRIVATE',
      delta: {},
      html: '',
    });
  }
}
