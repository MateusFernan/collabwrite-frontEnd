import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  imagensSidebar: {
    labelImagem: string;
    linkSVG: string;
    route?: string;
    action?: () => void;
  }[] = [
    {
      labelImagem: 'Biblioteca',
      linkSVG: 'assets/BIBLIOTECA.svg',
      route: '/documents',
    },
    {
      labelImagem: 'Explorar',
      linkSVG: 'assets/EXPLORAR.svg',
      route: '/explore',
    },
    {
      labelImagem: 'Config.',
      linkSVG: 'assets/CONFIG.svg',
      route: '/settings',
    },
    {
      labelImagem: 'Sair',
      linkSVG: 'assets/SAIR.svg',
      action: () => this._router.navigate(['/logout'], { replaceUrl: true }),
    },
  ];

  constructor(private _router: Router) {}
}
