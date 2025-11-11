import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentDto } from '../../models/documents.dto';
import { FormsModule } from '@angular/forms';
import { DocumentsService } from '../../core/services/documents.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  @Input() arquivos: DocumentDto[] = [];
  @Output() enviarArquivos: EventEmitter<DocumentDto[]> = new EventEmitter();
  textoParaPesquisar: string = '';

  constructor() {}

  pesquisar(): void {
    if (this.textoParaPesquisar == '') {
      DocumentsService.arquivosFiltrados = this.arquivos;
      return;
    }
    DocumentsService.arquivosFiltrados = this.arquivos.filter((element) =>
      element.title
        .toLowerCase()
        .includes(this.textoParaPesquisar.toLowerCase())
    );
  }
}
