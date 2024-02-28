import { FlashMessageType } from './types';

export function typeToSymbol(type: FlashMessageType): string {
  switch (type) {
    case 'info':
      return 'ⓘ';

    case 'warning':
      return '⚠';

    case 'error':
      return '☠';

    case 'success':
      return '✓';
  }
}
