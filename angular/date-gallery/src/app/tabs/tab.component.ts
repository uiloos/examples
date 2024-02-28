import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TabsService } from './TabsService';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class TabComponent implements OnInit {
  @Input() href = '';
  @Input() name = '';

  constructor(public tabsService?: TabsService) {}

  ngOnInit(): void {
    if (this.tabsService) {
      const content = this.tabsService.tabs.push({
        href: this.href,
        name: this.name,
      });

      if (content.isFirst || window.location.hash === this.href) {
        content.activate();
      }
    }
  }
}
