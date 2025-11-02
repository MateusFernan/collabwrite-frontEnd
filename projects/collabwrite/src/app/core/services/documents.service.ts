import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentDto, Visibility } from '../../models/documents.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private base = environment.apiUrl + '/documents';

  constructor(private http: HttpClient) {}

  getById(id: number) {
    return this.http.get<DocumentDto>(`${this.base}/${id}`);
  }

  create(payload: {
    title: string;
    visibility?: Visibility;
    delta?: unknown;
    html?: string;
  }) {
    return this.http.post<DocumentDto>(`${this.base}`, payload);
  }

  patchContent(id: number, delta: unknown, html: string) {
    return this.http.patch<{ id: number; updatedAt: string }>(
      `${this.base}/${id}/content`,
      { delta, html }
    );
  }
}
