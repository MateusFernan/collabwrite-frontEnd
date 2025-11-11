import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { DocumentsService } from '../../core/services/documents.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import { DocumentDto } from '../../models/documents.dto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
Quill.register('modules/cursors', QuillCursors);
@Component({
  selector: 'app-editor-colab',
  standalone: true,
  imports: [QuillModule, FormsModule, CommonModule],
  templateUrl: './editor-colab.component.html',
  styleUrls: ['./editor-colab.component.scss'],
})
export class EditorColabComponent implements OnInit, OnDestroy {
  private _auth = inject(AuthService);
  private _route = inject(ActivatedRoute);
  private _documentService = inject(DocumentsService);
  private _editor!: any;
  html = '';
  private _save$ = new Subject<{ delta: unknown; html: string }>();
  private _destroy$ = new Subject<void>();

  private _saving = false;
  saved = true;
  private _ydoc!: Y.Doc;
  private _provider!: WebsocketProvider;
  private _binding!: QuillBinding;
  private _role: 'user' | 'guest' = 'guest';
  private _docId!: string;
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: [1, 2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'code-block'],
      ['clean'],
    ],
    cursors: true,
  };
  private _initialized = false;
  title: string = '';

  ngOnInit() {
    this._updateContent();
    const tempToken = localStorage.getItem('tempToken');
    const token: any = tempToken || this._auth.getToken();
    this._role = tempToken ? 'guest' : 'user';
    console.log(
      JSON.parse(JSON.stringify(this._route.snapshot.paramMap.get('id')))
    );
    this._docId = this._route.snapshot.paramMap.get('id')!;
    this._getById();

    this._ydoc = new Y.Doc();
    this._provider = new WebsocketProvider(
      'wss://ws-collabwrite-production.up.railway.app',
      `doc-${this._docId}`,
      this._ydoc,
      { params: { token } }
    );
    this._initialized = true;
  }

  private _getById(): void {
    this._documentService
      .getById(Number(this._docId))
      .subscribe((doc: DocumentDto) => {
        this.html = doc.contentHtml ?? '';
        setTimeout(() => {
          if (doc.contentDelta && this._editor) {
            this._editor.setContents(doc.contentDelta);
            this.title = doc.title;
          }
        }, 0);
      });
  }

  private _updateContent(): void {
    this._save$
      .pipe(
        debounceTime(700),
        map((p) => JSON.stringify(p)),
        distinctUntilChanged(),
        map((s) => JSON.parse(s) as { delta: unknown; html: string }),
        tap(() => (this.saved = false)),
        switchMap(({ delta, html }) =>
          this._documentService
            .patchContent(Number(this._docId), delta, html)
            .pipe(catchError(() => of(null)))
        ),
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this.saved = true;
      });
  }

  onReady(editor: any) {
    this._editor = editor;
    const ytext = this._ydoc.getText('quill');
    this._binding = new QuillBinding(ytext, editor, this._provider.awareness);
    this._provider.on('status', (e: any) => console.log('🔌', e.status));
  }

  onChanged(e: any): void {
    if (!this._initialized) return;
    const delta = this._editor?.getContents();
    const html = e.html || '';
    this._save$.next({ delta, html });
  }

  ngOnDestroy() {
    this._binding?.destroy();
    this._provider?.destroy();
    this._ydoc?.destroy();
    localStorage.removeItem('tempToken');
  }
}
