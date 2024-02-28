import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabsService } from './TabsService';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  standalone: true,
  imports: [CommonModule],
  providers: [{ provide: TabsService }],
})
export class TabsComponent {
  constructor(public tabsService?: TabsService) {}
}
