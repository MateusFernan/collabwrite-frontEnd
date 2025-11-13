import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DialogModule } from '@angular/cdk/dialog';
import { DocumentsService } from '../../core/services/documents.service';
import { DocumentDto } from '../../models/documents.dto';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../../components/search/search.component';
import { GenericDocumentsComponent } from '../../components/generic-documents/generic-documents.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DialogModule,
    FormsModule,
    SearchComponent,
    GenericDocumentsComponent,
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
})
export class DocumentsComponent implements OnInit {
  arquivoPrincipal: DocumentDto = {
    title: 'Criar arquivo',
    id: -1,
    createdAt: '',
    updatedAt: '',
    visibility: 'PRIVATE',
    src: 'assets/CRIAR.svg',
  };
  arquivos: DocumentDto[] = [];

  constructor(private _documentService: DocumentsService) {}

  ngOnInit(): void {
    this._documentService.getFiles().subscribe((response) => {
      DocumentsService.arquivosFiltrados = [this.arquivoPrincipal, ...response];
      this.arquivos = [this.arquivoPrincipal, ...response];
    });
  }
}
