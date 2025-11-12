import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { QuillModule } from 'ngx-quill';
import { DocumentsService } from '../../core/services/documents.service';
import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { DocumentDto } from '../../models/documents.dto';
import { DialogComponent } from '../../components/dialog/dialog.component';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, QuillModule, CommonModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements OnInit, OnDestroy {
  html = '';
  isPublic = false;
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: [1, 2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'code-block'],
      ['clean'],
    ],
  };
  saved = true;
  title: string = '';

  private _destroy$ = new Subject<void>();
  private _docId!: number;
  private _initialized = false;
  private _quill!: any;
  private _save$ = new Subject<{ delta: unknown; html: string }>();
  private _visibilitySave$ = new Subject<'PUBLIC' | 'PRIVATE'>();

  constructor(
    private _route: ActivatedRoute,
    private _docs: DocumentsService,
    private _router: Router,
    private _dialog: Dialog
  ) {}

  abrirModal(): void {
    let dialogRef = this._dialog.open<string>(DialogComponent, {
      hasBackdrop: true,
      panelClass: 'cw-dialog-panel',
      backdropClass: 'cw-backdrop',
      data: {
        defaultTitle: '',
        label: 'Compartilhando arquivo...',
        animation: true,
      },
    });
    setTimeout(() => {
      this.onShare(dialogRef);
    }, 4500);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._initialized = false;
  }

  ngOnInit(): void {
    this._updateVisibility();
    this._updateContent();
    this._docId = Number(this._route.snapshot.paramMap.get('id'));
    this._docs.getById(this._docId).subscribe((doc: DocumentDto) => {
      this.html = doc.contentHtml ?? '';
      this.title = doc.title;
      setTimeout(() => {
        if (doc.contentDelta && this._quill) {
          this._quill.setContents(doc.contentDelta);
        }
        this._initialized = true;
      }, 0);
      this.isPublic = doc.visibility === 'PUBLIC';
    });
  }

  onChanged(e: any): void {
    if (!this._initialized) return;
    const delta = this._quill?.getContents();
    const html = e.html || '';
    this._save$.next({ delta, html });
  }

  onReady(q: any): void {
    this._quill = q;
  }

  onShare(dialogRef: DialogRef<string, unknown>): void {
    dialogRef.close();
    this._docs.generateShareLink(this._docId).subscribe({
      next: (res) => {
        navigator.clipboard.writeText(res.link);
        alert('Link copiado para a area de transferencias!');
        this._router.navigate(['/editor-colab', this._docId], {
          replaceUrl: true,
        });
      },
      error: () => alert('Erro ao gerar link de compartilhamento.'),
    });
  }

  toggleVisibility(): void {
    this.isPublic = !this.isPublic;
    const v = this.isPublic ? 'PUBLIC' : 'PRIVATE';
    this._visibilitySave$.next(v);
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
          this._docs
            .patchContent(this._docId, delta, html)
            .pipe(catchError(() => of(null)))
        ),
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this.saved = true;
      });
  }

  private _updateVisibility(): void {
    this._visibilitySave$
      .pipe(
        debounceTime(300),
        tap(() => (this.saved = false)),
        switchMap((v) =>
          this._docs
            .updateDocument(this._docId, { visibility: v })
            .pipe(catchError(() => of(null)))
        )
      )
      .subscribe(() => (this.saved = true));
  }
}
