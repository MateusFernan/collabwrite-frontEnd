import { Component, OnInit } from '@angular/core';
import { DocumentsService } from '../../core/services/documents.service';
import { DocumentDto } from '../../models/documents.dto';
import { SearchComponent } from '../../components/search/search.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GenericDocumentsComponent } from '../../components/generic-documents/generic-documents.component';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    SearchComponent,
    RouterModule,
    CommonModule,
    GenericDocumentsComponent,
  ],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss',
})
export class ExploreComponent implements OnInit {
  arquivosPublicos: DocumentDto[] = [];
  hover: number | null = null;

  private _documentService: DocumentsService;
  private _router: Router;

  constructor(documentService: DocumentsService, router: Router) {
    this._documentService = documentService;
    this._router = router;
  }

  abrirArquivo(id: number): void {
    this._router.navigate([`/read/${id}`]);
  }

  ngOnInit(): void {
    this._documentService.getPublicFiles().subscribe((response) => {
      DocumentsService.arquivosFiltrados = response;
      this.arquivosPublicos = response;
    });
  }
}
