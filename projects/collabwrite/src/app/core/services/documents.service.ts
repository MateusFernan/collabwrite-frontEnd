import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentDto, Visibility } from '../../models/documents.dto';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private _base = environment.apiUrl + '/documents';
  public static arquivosFiltrados: DocumentDto[] = [];
  constructor(private _http: HttpClient) {}

  getById(id: number): Observable<DocumentDto> {
    return this._http.get<DocumentDto>(`${this._base}/${id}`);
  }

  getSharedDoc(id: string): Observable<any> {
    return this._http.get<any>(`${this._base}/${id}`);
  }

  getFiles(): Observable<DocumentDto[]> {
    return this._http.get<DocumentDto[]>(`${this._base}/mine`);
  }

  updateDocument(id: number, payload: { visibility: Visibility }) {
    return this._http.put<DocumentDto>(`${this._base}/${id}`, payload);
  }

  getPublicFiles(): Observable<DocumentDto[]> {
    return this._http.get<DocumentDto[]>(`${this._base}/public`);
  }

  generateShareLink(id: number) {
    return this._http.post<any>(`${this._base}/${id}/share/`, {});
  }

  create(payload: {
    title: string;
    visibility?: Visibility;
    delta?: unknown;
    html?: string;
  }) {
    return this._http.post<DocumentDto>(`${this._base}`, payload);
  }

  patchContent(id: number, delta: unknown, html: string) {
    return this._http.patch<{ id: number; updatedAt: string }>(
      `${this._base}/${id}/content`,
      { delta, html }
    );
  }
}
