import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimationComponentComponent } from '../animation-component/animation-component.component';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    AnimationComponentComponent,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  data: any;
  title = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ],
  });

  private _ref: DialogRef<string>;

  constructor(
    @Inject(DIALOG_DATA) data: any,
    ref: DialogRef<string>
  ) {
    this.data = data;
    this._ref = ref;
  }

  close(): void {
    this._ref.close();
  }

  confirm(): void {
    if (this.title.invalid) return;
    this._ref.close(this.title.value.trim());
  }
}
