import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SegmentedButtonComponent } from './segmented-button.component';
import { SegmentedButtonItem } from './types';

type TextAlign = 'left' | 'center' | 'right';

@Component({
  selector: 'segmented-button-example',
  templateUrl: './segmented-button-example.component.html',
  styleUrl: './segmented-button-example.component.css',
  standalone: true,
  imports: [CommonModule, SegmentedButtonComponent],
})
export class SegmentedButtonExampleComponent {
  public textAlign: TextAlign = 'center';

  public buttons: SegmentedButtonItem[] = [
    {
      label: 'Left',
      onClick: () => {
        this.textAlign = 'left';
      },
    },
    {
      label: 'Center',
      onClick: () => {
        this.textAlign = 'center';
      },
      active: true,
    },
    {
      label: 'Right',
      onClick: () => {
        this.textAlign = 'right';
      },
    },
  ];
}
