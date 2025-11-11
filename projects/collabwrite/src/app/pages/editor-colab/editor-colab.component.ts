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
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private _documentService = inject(DocumentsService);
  private editor!: any;
  html = '';
  private _save$ = new Subject<{ delta: unknown; html: string }>();
  private _destroy$ = new Subject<void>();

  saving = false;
  saved = true;
  ydoc!: Y.Doc;
  provider!: WebsocketProvider;
  binding!: QuillBinding;
  role: 'user' | 'guest' = 'guest';
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
  initialized = false;
  title: string = '';

  ngOnInit() {
    this._updateContent();
    const tempToken = localStorage.getItem('tempToken');
    const token: any = tempToken || this.auth.getToken();
    this.role = tempToken ? 'guest' : 'user';
    console.log(
      JSON.parse(JSON.stringify(this.route.snapshot.paramMap.get('id')))
    );
    this._docId = this.route.snapshot.paramMap.get('id')!;
    this.getById();

    this.ydoc = new Y.Doc();
    this.provider = new WebsocketProvider(
      'wss://ws-collabwrite-production.up.railway.app',
      `doc-${this._docId}`,
      this.ydoc,
      { params: { token } }
    );
    this.initialized = true;
  }

  private getById(): void {
    this._documentService
      .getById(Number(this._docId))
      .subscribe((doc: DocumentDto) => {
        this.html = doc.contentHtml ?? '';
        setTimeout(() => {
          if (doc.contentDelta && this.editor) {
            this.editor.setContents(doc.contentDelta);
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
    this.editor = editor;
    const ytext = this.ydoc.getText('quill');
    this.binding = new QuillBinding(ytext, editor, this.provider.awareness);
    this.provider.on('status', (e: any) => console.log('🔌', e.status));
  }

  onChanged(e: any): void {
    if (!this.initialized) return;
    const delta = this.editor?.getContents();
    const html = e.html || '';
    this._save$.next({ delta, html });
  }

  ngOnDestroy() {
    this.binding?.destroy();
    this.provider?.destroy();
    this.ydoc?.destroy();
    localStorage.removeItem('tempToken');
  }
}
