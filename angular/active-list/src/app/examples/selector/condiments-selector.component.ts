import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CondimentComponent } from './condiment.component';
import { Condiment } from './types';
import { ActiveList } from '@uiloos/core';

@Component({
  selector: 'condiments-selector',
  templateUrl: './condiments-selector.component.html',
  styleUrls: ['./condiments-selector.component.css'],
  standalone: true,
  imports: [CommonModule, CondimentComponent],
})
export class CondimentsSelectorComponent {
  @Input() condiments!: Condiment[];

  public condimentsList!: ActiveList<Condiment>;

  private currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  ngOnInit(): void {
    const self = this;

    this.condimentsList = new ActiveList({
      contents: this.condiments,
      active: [],
      // Do not allow for more than three condiments.
      maxActivationLimit: 3,

      // When the limit is reached and more condiments are activated
      // simply ignore them and keep the original three condiments.
      maxActivationLimitBehavior: 'ignore',
    });
  }

  public cost(): string {
    const cost = this.condimentsList.activeContents.reduce((acc, content) => {
      return acc + content.value.price;
    }, 0);

    return this.currencyFormatter.format(cost);
  }
}
