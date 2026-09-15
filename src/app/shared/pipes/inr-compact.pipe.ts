import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'inrCompact', standalone: true })
export class InrCompactPipe implements PipeTransform {
  transform(value: number | null | undefined, decimals = 2): string {
    if (value === null || value === undefined || isNaN(value)) return '₹0';

    const sign = value < 0 ? '-' : '';
    const abs = Math.abs(value);

    if (abs >= 1_00_00_000) {
      return `${sign}₹${(abs / 1_00_00_000).toFixed(decimals)} Cr`;
    }
    if (abs >= 1_00_000) {
      return `${sign}₹${(abs / 1_00_000).toFixed(decimals)} L`;
    }
    if (abs >= 1_000) {
      return `${sign}₹${(abs / 1_000).toFixed(decimals)} K`;
    }
    return `${sign}₹${abs.toFixed(0)}`;
  }
}
