import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
})
export class DocumentsComponent {
  hover: number | null = null;
  arquivos: { labelImagem: string; linkSVG: string }[] = [
    {
      labelImagem: 'Criar Arquivo',
      linkSVG: 'assets/CRIAR.svg',
    },
    {
      labelImagem: 'Arquivo',
      linkSVG: 'assets/ARQUIVO FECHADO.svg',
    },
    {
      labelImagem: 'Arquivo',
      linkSVG: 'assets/ARQUIVO FECHADO.svg',
    },
    {
      labelImagem: 'Arquivo',
      linkSVG: 'assets/ARQUIVO FECHADO.svg',
    },
    {
      labelImagem: 'Arquivo',
      linkSVG: 'assets/ARQUIVO FECHADO.svg',
    },
    {
      labelImagem: 'Arquivo',
      linkSVG: 'assets/ARQUIVO FECHADO.svg',
    },
    {
      labelImagem: 'Arquivo',
      linkSVG: 'assets/ARQUIVO FECHADO.svg',
    },
    {
      labelImagem: 'Arquivo',
      linkSVG: 'assets/ARQUIVO FECHADO.svg',
    },
    {
      labelImagem: 'Arquivo',
      linkSVG: 'assets/ARQUIVO FECHADO.svg',
    },
  ];

  constructor(private _router: Router) {}
}
