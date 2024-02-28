import { Component } from '@angular/core';
import { CondimentsSelectorComponent } from './condiments-selector.component';
import { Condiment } from './types';

@Component({
  selector: 'condiment-selector-example',
  template: `
    <div class="selector-example">
      <condiments-selector [condiments]="condiments" />
    </div>
  `,
  styleUrls: ['./condiment-selector-example.component.css'],
  standalone: true,
  imports: [CondimentsSelectorComponent],
})
export class CondimentSelectorExample {
  public condiments: Condiment[] = [
    {
      id: 1,
      name: 'Bacon',
      price: 1.44,
      description: 'Our bacon is crispy and delicious',
    },
    {
      id: 2,
      name: 'Pickles',
      price: 2.05,
      description: 'Pickeles sweet and a little sour',
    },
    {
      id: 3,
      name: 'Gorgonzola',
      price: 4.99,
      description: 'A smelly cheese not for the faint of heart',
    },
    {
      id: 4,
      name: 'Cheddar',
      price: 0.95,
      description: 'A simple classic cheddar cheese',
    },
    {
      id: 5,
      name: 'Hamburger',
      price: 2.79,
      description: 'Put another hamburger on there for double the fun',
    },
    {
      id: 6,
      name: 'Egg',
      price: 0.29,
      description: 'Put an egg on it',
    },
    {
      id: 7,
      name: 'Argula',
      price: 1.49,
      description: 'A nutty tasting salad',
    },
  ];
}
