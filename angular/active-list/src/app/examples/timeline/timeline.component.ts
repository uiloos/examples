import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActiveList } from '@uiloos/core';
import { TimelineItem } from './types';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class TimelineComponent implements OnInit {
  @Input() items!: TimelineItem[];

  public timeline!: ActiveList<TimelineItem>;

  ngOnInit() {
    this.timeline = new ActiveList({
      contents: this.items,
      activeIndexes: [0],
    });
  }
}
