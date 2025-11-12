import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentDto, Visibility } from '../../models/documents.dto';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  static arquivosFiltrados: DocumentDto[] = [];

  private _base = environment.apiUrl + '/documents';

  constructor(private _http: HttpClient) {}

  create(payload: {
    title: string;
    visibility?: Visibility;
    delta?: unknown;
    html?: string;
  }): Observable<DocumentDto> {
    return this._http.post<DocumentDto>(`${this._base}`, payload);
  }

  generateShareLink(id: number): Observable<any> {
    return this._http.post<any>(`${this._base}/${id}/share/`, {});
  }

  getById(id: number): Observable<DocumentDto> {
    return this._http.get<DocumentDto>(`${this._base}/${id}`);
  }

  getFiles(): Observable<DocumentDto[]> {
    return this._http.get<DocumentDto[]>(`${this._base}/mine`);
  }

  getPublicFiles(): Observable<DocumentDto[]> {
    return this._http.get<DocumentDto[]>(`${this._base}/public`);
  }

  getSharedDoc(id: string): Observable<any> {
    return this._http.get<any>(`${this._base}/${id}`);
  }

  patchContent(
    id: number,
    delta: unknown,
    html: string
  ): Observable<{ id: number; updatedAt: string }> {
    return this._http.patch<{ id: number; updatedAt: string }>(
      `${this._base}/${id}/content`,
      { delta, html }
    );
  }

  updateDocument(
    id: number,
    payload: { visibility: Visibility }
  ): Observable<DocumentDto> {
    return this._http.put<DocumentDto>(`${this._base}/${id}`, payload);
  }
}
