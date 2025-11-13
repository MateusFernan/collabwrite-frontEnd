import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { DocumentsService } from '../../core/services/documents.service';
import { DocumentDto } from '../../models/documents.dto';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../../components/search/search.component';

@Component({
  selector: 'app-generic-documents',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DialogModule,
    FormsModule,
    SearchComponent,
  ],
  templateUrl: './generic-documents.component.html',
  styleUrl: './generic-documents.component.scss',
})
export class GenericDocumentsComponent {
  @Input() explore: Boolean = false;
  @Input() arquivos: DocumentDto[] = [];
  hover: number | null = null;
  textoParaPesquisar: string = '';

  constructor(private _dialog: Dialog, private _router: Router) {}

  abrirArquivo(id: number): void {
    this._router.navigate([`${this.explore ? '/read/' : '/editor'}/${id}`]);
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
}
