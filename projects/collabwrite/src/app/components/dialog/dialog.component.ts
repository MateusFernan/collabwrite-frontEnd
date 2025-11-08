import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ReactiveFormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  title = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ],
  });

  constructor(
    private _ref: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any
  ) {}

  confirm(): void {
    if (this.title.invalid) return;
    this._ref.close(this.title.value.trim());
  }

  close(): void {
    this._ref.close();
  }
}
