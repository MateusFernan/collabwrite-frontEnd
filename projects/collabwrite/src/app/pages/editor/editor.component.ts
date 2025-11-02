import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { DocumentsService } from '../../core/services/documents.service';
import {
  Subject,
  debounceTime,
  map,
  distinctUntilChanged,
  takeUntil,
} from 'rxjs';
import { DocumentDto } from '../../models/documents.dto';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, QuillModule, CommonModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements OnInit, OnDestroy {
  docId!: number;
  html = '';
  quill!: any;
  saved = true;

  private destroy$ = new Subject<void>();
  private save$ = new Subject<{ delta: unknown; html: string }>();

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

  constructor(private route: ActivatedRoute, private docs: DocumentsService) {
    this.save$
      .pipe(
        debounceTime(700),
        map((p) => JSON.stringify(p)),
        distinctUntilChanged(),
        map((s) => JSON.parse(s)),
        takeUntil(this.destroy$)
      )
      .subscribe(({ delta, html }) => {
        this.saved = false;
        this.docs.patchContent(this.docId, delta, html).subscribe({
          next: () => (this.saved = true),
          error: () => (this.saved = true),
        });
      });
  }

  ngOnInit(): void {
    this.docId = Number(this.route.snapshot.paramMap.get('id'));
    this.docs.getById(this.docId).subscribe((doc: DocumentDto) => {
      this.html = doc.contentHtml ?? '';
      setTimeout(() => {
        if (doc.contentDelta && this.quill)
          this.quill.setContents(doc.contentDelta);
      }, 0);
    });
  }

  onReady(q: any) {
    this.quill = q;
  }
  onChanged(e: any) {
    const delta = this.quill?.getContents();
    const html = e.html || '';
    this.save$.next({ delta, html });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
