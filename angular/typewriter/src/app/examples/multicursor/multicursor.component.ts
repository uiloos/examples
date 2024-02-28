import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { Typewriter, TypewriterCursor, TypewriterPosition } from '@uiloos/core';

type Data = {
  name: string;
  color: string;
};

@Component({
  selector: 'multicursor',
  styleUrls: ['./multicursor.component.css'],
  templateUrl: './multicursor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class MulticursorComponent {
  constructor(private ref: ChangeDetectorRef) {}

  public typewriter = new Typewriter<Data>(
    {
      repeat: true,
      repeatDelay: 10000,
      cursors: [
        {
          position: 0,
          data: {
            name: 'Jim',
            color: '#ef4444',
          },
        },
        {
          position: 0,
          data: {
            name: 'Dwight',
            color: '#d946ef',
          },
        },
        {
          position: 0,
          data: {
            name: 'Pam',
            color: '#22c55e',
          },
        },
        {
          position: 0,
          data: {
            name: 'Michael',
            color: '#3b82f6',
          },
        },
      ],
      // Created using the Typewriter composer: https://www.uiloos.dev/docs/typewriter/composer/
      actions: [
        {
          type: 'keyboard',
          cursor: 0,
          text: 'W',
          delay: 50,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'i',
          delay: 87,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 't',
          delay: 141,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'h',
          delay: 76,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: ' ',
          delay: 99,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'c',
          delay: 44,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'o',
          delay: 79,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'l',
          delay: 30,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'l',
          delay: 113,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'a',
          delay: 80,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'b',
          delay: 44,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: ' ',
          delay: 72,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'y',
          delay: 64,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'o',
          delay: 87,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'u',
          delay: 56,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: ' ',
          delay: 80,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'c',
          delay: 88,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'a',
          delay: 84,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'n',
          delay: 59,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: ' ',
          delay: 73,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'c',
          delay: 8,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'r',
          delay: 44,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'e',
          delay: 76,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'a',
          delay: 108,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 't',
          delay: 100,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'e',
          delay: 47,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: ' ',
          delay: 133,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'w',
          delay: 177,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'i',
          delay: 102,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'k',
          delay: 160,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'i',
          delay: 152,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 's',
          delay: 116,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: ',',
          delay: 124,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: ' ',
          delay: 83,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'd',
          delay: 53,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'o',
          delay: 64,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'c',
          delay: 125,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'u',
          delay: 108,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'm',
          delay: 55,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'e',
          delay: 109,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'n',
          delay: 87,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 't',
          delay: 100,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 's',
          delay: 96,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: ',',
          delay: 75,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: ' ',
          delay: 40,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'p',
          delay: 100,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'r',
          delay: 106,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 's',
          delay: 100,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'e',
          delay: 139,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'n',
          delay: 132,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 't',
          delay: 104,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'a',
          delay: 55,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 't',
          delay: 160,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'i',
          delay: 78,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'o',
          delay: 61,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'n',
          delay: 44,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 's',
          delay: 50,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: ',',
          delay: 44,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: ' ',
          delay: 84,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'a',
          delay: 100,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'n',
          delay: 99,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'd',
          delay: 84,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: ' ',
          delay: 61,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'p',
          delay: 124,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'r',
          delay: 151,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'o',
          delay: 105,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'j',
          delay: 60,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'e',
          delay: 49,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'c',
          delay: 88,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 't',
          delay: 158,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'z',
          delay: 88,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: ' ',
          delay: 156,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 't',
          delay: 43,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'o',
          delay: 63,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'g',
          delay: 33,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'e',
          delay: 144,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 't',
          delay: 87,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'h',
          delay: 43,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'e',
          delay: 96,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: 'r',
          delay: 69,
        },
        {
          type: 'keyboard',
          cursor: 0,
          text: '.',
          delay: 43,
        },
        {
          type: 'mouse',
          cursor: 1,
          position: 5,
          delay: 50,
        },
        {
          type: 'keyboard',
          cursor: 1,
          text: '"',
          delay: 500,
        },
        {
          type: 'mouse',
          cursor: 1,
          position: 12,
          delay: 34,
        },
        {
          type: 'keyboard',
          cursor: 1,
          text: '"',
          delay: 500,
        },
        {
          type: 'mouse',
          cursor: 1,
          position: 49,
          delay: 50,
        },
        {
          type: 'keyboard',
          cursor: 1,
          text: 'e',
          delay: 500,
        },
        {
          type: 'mouse',
          cursor: 1,
          position: 74,
          delay: 50,
        },
        {
          type: 'keyboard',
          cursor: 1,
          text: '⌫',
          delay: 500,
        },
        {
          type: 'keyboard',
          cursor: 1,
          text: 's',
          delay: 66,
        },
        {
          type: 'mouse',
          cursor: 2,
          position: 45,
          selection: {
            start: 36,
            end: 45,
          },
          delay: 70,
        },
        {
          type: 'keyboard',
          cursor: 2,
          text: 'd',
          delay: 1000,
        },
        {
          type: 'keyboard',
          cursor: 2,
          text: 'o',
          delay: 178,
        },
        {
          type: 'keyboard',
          cursor: 2,
          text: 'c',
          delay: 101,
        },
        {
          type: 'keyboard',
          cursor: 2,
          text: 's',
          delay: 73,
        },
        {
          type: 'mouse',
          cursor: 2,
          position: 55,
          selection: {
            start: 42,
            end: 55,
          },
          delay: 76,
        },
        {
          type: 'keyboard',
          cursor: 2,
          text: 's',
          delay: 1000,
        },
        {
          type: 'keyboard',
          cursor: 2,
          text: 'l',
          delay: 131,
        },
        {
          type: 'keyboard',
          cursor: 2,
          text: 'i',
          delay: 122,
        },
        {
          type: 'keyboard',
          cursor: 2,
          text: 'd',
          delay: 88,
        },
        {
          type: 'keyboard',
          cursor: 2,
          text: 'e',
          delay: 100,
        },
        {
          type: 'keyboard',
          cursor: 2,
          text: 's',
          delay: 160,
        },
        {
          type: 'mouse',
          cursor: 2,
          position: 72,
          delay: 50,
        },
        {
          type: 'keyboard',
          cursor: 2,
          text: '⌫',
          delay: 150,
        },
        {
          type: 'keyboard',
          cursor: 2,
          text: ' ',
          delay: 82,
        },
        {
          type: 'keyboard',
          cursor: 2,
          text: '❤️',
          delay: 50,
        },
        {
          type: 'keyboard',
          cursor: 3,
          text: ' ',
          delay: 50,
        },
        {
          type: 'keyboard',
          cursor: 3,
          text: '⌫',
          delay: 50,
        },
        {
          type: 'mouse',
          cursor: 3,
          position: 74,
          delay: 100,
        },
        {
          type: 'keyboard',
          cursor: 3,
          text: ' ',
          delay: 125,
        },
        {
          type: 'keyboard',
          cursor: 3,
          text: 'N',
          delay: 100,
        },
        {
          type: 'keyboard',
          cursor: 3,
          text: 'o',
          delay: 77,
        },
        {
          type: 'keyboard',
          cursor: 3,
          text: 'w',
          delay: 92,
        },
        {
          type: 'keyboard',
          cursor: 3,
          text: ' ',
          delay: 65,
        },
        {
          type: 'keyboard',
          cursor: 3,
          text: 'w',
          delay: 100,
        },
        {
          type: 'keyboard',
          cursor: 3,
          text: 'i',
          delay: 86,
        },
        {
          type: 'keyboard',
          cursor: 3,
          text: 't',
          delay: 53,
        },
        {
          type: 'keyboard',
          cursor: 3,
          text: 'h',
          delay: 87,
        },
        {
          type: 'keyboard',
          cursor: 3,
          text: ' ',
          delay: 136,
        },
        {
          type: 'keyboard',
          cursor: 3,
          text: 'A',
          delay: 78,
        },
        {
          type: 'keyboard',
          cursor: 3,
          text: 'I',
          delay: 114,
        },
        {
          type: 'keyboard',
          cursor: 3,
          text: '!',
          delay: 44,
        },
      ],
    },
    () => {
      // Only update the component when something changes.
      this.ref.markForCheck();
    }
  );

  public getBackgroundColorForPosition(position: TypewriterPosition<Data>) {
    const selected = position.selected;

    if (selected.length === 0) {
      return '';
    }

    // 30 transparency
    return selected[selected.length - 1].data?.color + '30';
  }

  public cursorTracker(index: number, cursor: TypewriterCursor<Data>) {
    return cursor.data?.name;
  }

  public positionTracker(index: number, position: TypewriterPosition<Data>) {
    return position.position;
  }
}
