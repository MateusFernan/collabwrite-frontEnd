import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AnimationComponentComponent } from '../../components/animation-component/animation-component.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterModule,
    AnimationComponentComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  hoverIndex: number | null = null;
  imagensMobile: {
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

  animationsSidebar: {
    labelImagem: string;
    linkAnimation: string;
    route?: string;
    action?: () => void;
  }[] = [
    {
      labelImagem: 'Biblioteca',
      linkAnimation: 'assets/animations/data.json',
      route: '/documents',
    },
    {
      labelImagem: 'Explorar',
      linkAnimation: 'assets/animations/EXPLORAR.json',
      route: '/explore',
    },
    {
      labelImagem: 'Config.',
      linkAnimation: 'assets/animations/CONFIG.json',
      route: '/settings',
    },
    {
      labelImagem: 'Sair',
      linkAnimation: 'assets/animations/SAIR.json',
      action: () => this._router.navigate(['/logout'], { replaceUrl: true }),
    },
  ];

  constructor(private _router: Router) {}
}
