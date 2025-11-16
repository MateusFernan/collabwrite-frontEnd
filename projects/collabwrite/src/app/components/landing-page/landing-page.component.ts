import { Component } from '@angular/core';
import { AnimationComponentComponent } from '../animation-component/animation-component.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [AnimationComponentComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {}
