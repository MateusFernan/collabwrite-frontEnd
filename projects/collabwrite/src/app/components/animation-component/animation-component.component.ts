import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import type { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-animation-component',
  standalone: true,
  imports: [],
  template: `
    <div
      class="pointer-events-none select-none flex items-center justify-center overflow-hidden"
      [style.width.px]="width ?? 280"
      [style.height.px]="height ?? 160"
    >
      <div
        #container
        class="lottie-inner"
        [style.transform]="'scale(' + scale + ')'"
      ></div>
    </div>
  `,
  styleUrl: './animation-component.component.scss',
})
export class AnimationComponentComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() autoplay = true;
  @Input() height?: number;
  @Input() loop: boolean | number = true;
  @Input() path = 'assets/animations/pasta_anima.json';
  @Input() scale = 1;
  @Input() width?: number;

  private _anim?: AnimationItem;
  private _el: ElementRef<HTMLElement>;

  constructor(el: ElementRef<HTMLElement>) {
    this._el = el;
  }

  async ngAfterViewInit(): Promise<void> {
    const container = this._el.nativeElement.querySelector('.lottie-inner')!;
    const lottie = await import('lottie-web');

    this._anim = lottie.default.loadAnimation({
      container,
      renderer: 'svg',
      loop: this.loop,
      autoplay: this.autoplay,
      path: this.path,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this._anim ||
      !changes['autoplay'] ||
      changes['autoplay'].firstChange
    ) {
      return;
    }
    if (changes['autoplay'].currentValue) {
      this._anim.play();
    } else {
      this._anim.stop();
    }
  }

  ngOnDestroy(): void {
    this._anim?.destroy?.();
  }
}
