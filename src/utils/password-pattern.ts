// password-pattern.util.ts
export function applyPasswordPattern(value: string): string {
  if (!value) return '';

  
  let chars = value.split('').map(c => {
    if (c >= 'a' && c <= 'z') return c.toUpperCase();
    if (c >= 'A' && c <= 'Z') return c.toLowerCase();
    return c;
  });

  chars.reverse();

  // let lastChar: string | null = null;

  // // Handle odd length
  // if (chars.length % 2 !== 0) {
  //   lastChar = chars.pop()!;
  // }

  for (let i = 0; i < chars.length - 1; i += 2) {
    [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
  }


  // // Restore odd character
  // if (lastChar) {
  //   chars.unshift(lastChar);
  // }
  return chars.join('');
}
