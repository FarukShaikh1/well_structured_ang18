import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passwordPattern',
  standalone: true
})
export class PasswordPatternPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    // Step 1: reverse case
    let chars = value.split('').map(c => {
      if (c >= 'a' && c <= 'z') return c.toUpperCase();
      if (c >= 'A' && c <= 'Z') return c.toLowerCase();
      return c;
    });

    // let lastChar: string | null = null;

    // // Handle odd length
    // if (chars.length % 2 !== 0) {
    //   lastChar = chars.pop()!;
    // }
    // Step 2: swap odd-even positions
    for (let i = 0; i < chars.length - 1; i += 2) {
      [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
    }

    // Step 3: reverse full string
    // chars.reverse();

    // // Restore odd character
    // if (lastChar) {
    //   chars.unshift(lastChar);
    // }
    return chars.join('');
  }
}

