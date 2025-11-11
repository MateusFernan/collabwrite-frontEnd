import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { DocumentsService } from '../../core/services/documents.service';
import { finalize } from 'rxjs';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import { DocumentDto } from '../../models/documents.dto';
import { FormsModule } from '@angular/forms';
Quill.register('modules/cursors', QuillCursors);
@Component({
  selector: 'app-editor-colab',
  standalone: true,
  imports: [QuillModule, FormsModule],
  templateUrl: './editor-colab.component.html',
  styleUrls: ['./editor-colab.component.scss'],
})
export class EditorColabComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private _documentService = inject(DocumentsService);
  private editor!: any;
  html = '';

  saving = false;
  saved = false;
  ydoc!: Y.Doc;
  provider!: WebsocketProvider;
  binding!: QuillBinding;
  role: 'user' | 'guest' = 'guest';
  docId!: string;
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

  ngOnInit() {
    const tempToken = localStorage.getItem('tempToken');
    const token: any = tempToken || this.auth.getToken();
    this.role = tempToken ? 'guest' : 'user';
    console.log(
      JSON.parse(JSON.stringify(this.route.snapshot.paramMap.get('id')))
    );
    this.docId = this.route.snapshot.paramMap.get('id')!;

    this.ydoc = new Y.Doc();
    //this.getById();
    this.provider = new WebsocketProvider(
      'wss://https://ws-collabwrite-production.up.railway.app',
      `doc-${this.docId}`,
      this.ydoc,
      { params: { token } }
    );
  }

  private getById(): void {
    this._documentService
      .getById(Number(this.docId))
      .subscribe((doc: DocumentDto) => {
        this.html = doc.contentHtml ?? '';
        setTimeout(() => {
          if (doc.contentDelta && this.editor) {
            this.editor.setContents(doc.contentDelta);
          }
        }, 0);
      });
  }

  onSave() {
    if (this.role === 'guest') {
      alert('Convidados não podem salvar no documento original.');
      return;
    }
    if (!this.editor) return;
    console.log(this.route.snapshot.paramMap);

    this.saving = true;
    const delta = this.editor.getContents();
    const html = this.editor.root.innerHTML;
    this._documentService
      .patchContent(Number(this.docId), delta, html)
      .pipe(finalize(() => ((this.saving = false), alert('Salvo'))))
      .subscribe({
        next: () => {
          this.saved = true;
          setTimeout(() => (this.saved = false), 5000);
        },
        error: () => alert('Erro ao salvar. Tente novamente.'),
      });
  }

  onReady(editor: any) {
    this.editor = editor;

    const ytext = this.ydoc.getText('quill');
    this.binding = new QuillBinding(ytext, editor, this.provider.awareness);
    this.provider.on('status', (e: any) => console.log('🔌', e.status));
  }

  ngOnDestroy() {
    this.binding?.destroy();
    this.provider?.destroy();
    this.ydoc?.destroy();
    localStorage.removeItem('tempToken');
  }
}
