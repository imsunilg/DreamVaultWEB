import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'inr', standalone: true })
export class InrPipe implements PipeTransform {
  private formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) return '₹0';
    return this.formatter.format(value);
  }
}
