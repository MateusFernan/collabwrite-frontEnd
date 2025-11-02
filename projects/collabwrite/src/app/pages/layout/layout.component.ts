import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  imagensSidebar: { labelImagem: string; linkSVG: string }[] = [
    {
      labelImagem: 'Biblioteca',
      linkSVG: 'assets/BIBLIOTECA.svg',
    },
    {
      labelImagem: 'Explorar',
      linkSVG: 'assets/EXPLORAR.svg',
    },
    {
      labelImagem: 'Config.',
      linkSVG: 'assets/CONFIG.svg',
    },
    {
      labelImagem: 'Sair',
      linkSVG: 'assets/SAIR.svg',
    },
  ];
}
