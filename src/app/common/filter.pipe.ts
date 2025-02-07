import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      // Customize this condition based on your filtering requirements
      return item.name.toLowerCase().includes(searchText);
    });
  }
}



@Pipe({
  name: 'filterWithMenteeFirstNamePipe'
})
export class FilterWithMenteeFirstNamePipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      // Customize this condition based on your filtering requirements
      return item.menteeFirstName.toLowerCase().includes(searchText);
    });
  }
}

