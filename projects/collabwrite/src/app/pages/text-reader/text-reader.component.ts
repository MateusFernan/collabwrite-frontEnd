import { Component, OnInit } from '@angular/core';
import { DocumentsService } from '../../core/services/documents.service';
import { DocumentDto } from '../../models/documents.dto';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-reader',
  standalone: true,
  imports: [NgxTypedJsModule, CommonModule],
  templateUrl: './text-reader.component.html',
  styleUrl: './text-reader.component.scss',
})
export class TextReaderComponent implements OnInit {
  html = '';
  title: string = '';

  private _docId!: number;
  private _documentService: DocumentsService;
  private _route: ActivatedRoute;

  constructor(documentService: DocumentsService, route: ActivatedRoute) {
    this._documentService = documentService;
    this._route = route;
  }

  ngOnInit(): void {
    this._docId = Number(this._route.snapshot.paramMap.get('id'));

    this._documentService.getById(this._docId).subscribe((doc: DocumentDto) => {
      this.html = doc.contentHtml ?? '';
      this.title = doc.title;
    });
  }
}
