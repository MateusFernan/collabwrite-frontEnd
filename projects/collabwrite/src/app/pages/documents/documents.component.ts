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
  hover: number | null = null;
  arquivos: DocumentDto[] = [];
  arquivoPrincipal: DocumentDto = {
    title: 'Criar arquivo',
    id: -1,
    createdAt: '',
    updatedAt: '',
    visibility: 'PRIVATE',
    src: 'assets/CRIAR.svg',
  };
  textoParaPesquisar: string = '';
  constructor(
    private _router: Router,
    private _dialog: Dialog,
    private _documentService: DocumentsService
  ) {}

  ngOnInit(): void {
    this._documentService.getFiles().subscribe((response) => {
      DocumentsService.arquivosFiltrados = [this.arquivoPrincipal, ...response];
      this.arquivos = [this.arquivoPrincipal, ...response];
    });
  }

  criarTexto(): void {
    const modal = this._dialog.open<string>(DialogComponent, {
      hasBackdrop: true,
      panelClass: 'cw-dialog-panel',
      backdropClass: 'cw-backdrop',
      data: { defaultTitle: '' },
    });

    modal.closed.subscribe((title) => {
      if (typeof title === 'string' && title.trim()) {
        this._router.navigate(['/editor/new'], { queryParams: { title } });
      }
    });
  }

  abrirArquivo(id: number): void {
    this._router.navigate([`/editor/${id}`]);
  }

  get arquivosFiltrados(): DocumentDto[] {
    return DocumentsService.arquivosFiltrados;
  }
}
