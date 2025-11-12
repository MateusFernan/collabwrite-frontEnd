import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { DocumentsService } from '../../core/services/documents.service';
import { DocumentDto } from '../../models/documents.dto';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../../components/search/search.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DialogModule,
    FormsModule,
    SearchComponent,
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
  hover: number | null = null;
  textoParaPesquisar: string = '';

  private _dialog: Dialog;
  private _documentService: DocumentsService;
  private _router: Router;

  constructor(
    dialog: Dialog,
    documentService: DocumentsService,
    router: Router
  ) {
    this._dialog = dialog;
    this._documentService = documentService;
    this._router = router;
  }

  abrirArquivo(id: number): void {
    this._router.navigate([`/editor/${id}`]);
  }

  get arquivosFiltrados(): DocumentDto[] {
    return DocumentsService.arquivosFiltrados;
  }

  criarTexto(): void {
    const modal = this._dialog.open<string>(DialogComponent, {
      hasBackdrop: true,
      panelClass: 'cw-dialog-panel',
      backdropClass: 'cw-backdrop',
      data: { defaultTitle: '', label: 'nome do arquivo' },
    });

    modal.closed.subscribe((title) => {
      if (typeof title === 'string' && title.trim()) {
        this._router.navigate(['/editor/new'], { queryParams: { title } });
      }
    });
  }

  ngOnInit(): void {
    this._documentService.getFiles().subscribe((response) => {
      DocumentsService.arquivosFiltrados = [this.arquivoPrincipal, ...response];
      this.arquivos = [this.arquivoPrincipal, ...response];
    });
  }
}
