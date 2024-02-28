import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AccordionItem } from './types';
import { ActiveList } from '@uiloos/core';
import { AccordionComponent } from './accordion.component';

@Component({
  selector: 'accordion-example',
  templateUrl: './accordion-example.component.html',
  standalone: true,
  imports: [CommonModule, AccordionComponent],
})
export class AccordionExampleComponent {
  public items: AccordionItem[] = [
    {
      id: 1,
      summary: 'What is the meaning of life?',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga commodi tenetur dignissimos maxime reprehenderit quam hic, molestiae nisi dolorem nihil dolor illum asperiores incidunt distinctio quod modi, corporis quae neque!',
    },
    {
      id: 2,
      summary: 'How many eggs are in the basket?',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga commodi tenetur dignissimos maxime reprehenderit quam hic, molestiae nisi dolorem nihil dolor illum asperiores incidunt distinctio quod modi, corporis quae neque!',
    },
    {
      id: 3,
      summary: 'Who dunnit?',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga commodi tenetur dignissimos maxime reprehenderit quam hic, molestiae nisi dolorem nihil dolor illum asperiores incidunt distinctio quod modi, corporis quae neque!',
    },
  ];
}
