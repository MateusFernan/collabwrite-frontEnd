import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DocumentsService } from '../../core/services/documents.service';
import { DocumentDto } from '../../models/documents.dto';

@Injectable({ providedIn: 'root' })
export class NewDocResolver implements Resolve<DocumentDto> {
  constructor(private _docs: DocumentsService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<DocumentDto> {
    const title = route.queryParamMap.get('title')?.trim() || 'Sem título';
    return this._docs.create({
      title,
      visibility: 'PRIVATE',
      delta: {},
      html: '',
    });
  }
}
