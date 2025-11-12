import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface SharedDocDto {
  title: string;
  docId: number;
  tokenTemporario: string;
  author: number;
  expiresIn: string;
}

@Injectable({ providedIn: 'root' })
export class SharedService {
  private _api = `${environment.apiUrl}/documents`;
  private _http = inject(HttpClient);

  getSharedDoc(id: string): Observable<SharedDocDto> {
    return this._http.get<SharedDocDto>(`${this._api}/share/${id}`);
  }
}
