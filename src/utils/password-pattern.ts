// password-pattern.util.ts
export function applyPasswordPattern(value: string, shift = 5): string {
  if (!value) return '';

  const min = 32;
  const max = 126;

  value = value.split('').map(c => {
    const code = c.charCodeAt(0);

    if (code < min || code > max) return c;

    let shifted = code - shift;
    if (shifted < min) {
      shifted = max - (min - shifted - 1);
    }

    return String.fromCharCode(shifted);
  }).join('');

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
