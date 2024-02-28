import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SegmentedButtonItem } from './types';
import { ActiveList, ActiveListContent } from '@uiloos/core';

@Component({
  selector: 'segmented-button',
  templateUrl: './segmented-button.component.html',
  styleUrls: ['./segmented-button.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class SegmentedButtonComponent implements OnInit {
  @Input() buttons!: SegmentedButtonItem[];

  public segmentedButtons!: ActiveList<SegmentedButtonItem>;

  ngOnInit(): void {
    this.segmentedButtons = new ActiveList<SegmentedButtonItem>({
      contents: this.buttons,
      active: this.buttons.find((button) => button.active),
    });
  }

  public activate(
    event: MouseEvent,
    content: ActiveListContent<SegmentedButtonItem>,
  ) {
    content.activate();
    content.value.onClick(event);
  }
}
