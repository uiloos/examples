import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AccordionItem } from './types';
import { ActiveList, ActiveListContent } from '@uiloos/core';

@Component({
  selector: 'accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class AccordionComponent implements OnInit {
  @Input() items!: AccordionItem[];
  @Input() activeId!: number;

  public accordion!: ActiveList<AccordionItem>;

  ngOnInit(): void {
    this.accordion = new ActiveList<AccordionItem>({
      contents: this.items,
      active:
        this.items.find((item) => item.id === this.activeId) ?? this.items[0],
    });
  }

  // Prevent default opening of details element, // and let the ActiveList
  public open(event: MouseEvent, content: ActiveListContent<AccordionItem>) {
    event.preventDefault();
    content.activate();
  }
}
