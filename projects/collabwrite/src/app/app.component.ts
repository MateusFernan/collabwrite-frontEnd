import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnimationComponentComponent } from './components/animation-component/animation-component.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AnimationComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'collabwrite';
}
