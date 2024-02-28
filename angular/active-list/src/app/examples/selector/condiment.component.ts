import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActiveListContent } from '@uiloos/core';
import { Condiment } from './types';

@Component({
  selector: 'condiment',
  templateUrl: './condiment.component.html',
  styleUrls: ['./condiment.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class CondimentComponent {
  @Input() content!: ActiveListContent<Condiment>;
}
