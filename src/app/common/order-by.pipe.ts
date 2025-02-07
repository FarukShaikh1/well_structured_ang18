import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(items: any[], key: string, reverse: boolean = false): any[] {
    if (!items) return [];
    if (!key) return items;

    return items.sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (valueA < valueB) {
        return reverse ? 1 : -1;
      } else if (valueA > valueB) {
        return reverse ? -1 : 1;
      } else {
        return 0;
      }
    });
  }
}
