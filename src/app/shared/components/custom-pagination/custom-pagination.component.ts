import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

export interface PaginationEvent {
  first: number;
  rows: number;
  page: number;
}

@Component({
  selector: 'app-custom-pagination',
  standalone: false,
  templateUrl: './custom-pagination.component.html',
  styleUrl: './custom-pagination.component.scss'
})
export class CustomPaginationComponent implements OnChanges {
  @Input() totalRecords: number = 0;
  @Input() rows: number = 12;
  @Input() first: number = 0;
  @Input() showPageInfo: boolean = true;
  @Input() rowsPerPageOptions: number[] = [6, 12, 24, 48];

  @Output() onPageChange = new EventEmitter<PaginationEvent>();

  currentPage: number = 1;
  totalPages: number = 1;
  visiblePages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePagination();
  }

  private calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.rows);
    this.currentPage = Math.floor(this.first / this.rows) + 1;
    this.generateVisiblePages();
  }

  private generateVisiblePages(): void {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, this.currentPage - delta); 
         i <= Math.min(this.totalPages - 1, this.currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (this.currentPage - delta > 2) {
      rangeWithDots.push(1, -1);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (this.currentPage + delta < this.totalPages - 1) {
      rangeWithDots.push(-1, this.totalPages);
    } else if (this.totalPages > 1) {
      rangeWithDots.push(this.totalPages);
    }

    this.visiblePages = rangeWithDots;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    const first = (page - 1) * this.rows;
    this.emitPageChange(first, this.rows, page);
  }

  goToPrevious(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNext(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newRows = +target.value;
    this.changePageSize(newRows);
  }

  changePageSize(newRows: number): void {
    this.rows = newRows;
    this.goToPage(1);
  }

  private emitPageChange(first: number, rows: number, page: number): void {
    this.onPageChange.emit({ first, rows, page });
  }

  get startRecord(): number {
    return this.totalRecords === 0 ? 0 : this.first + 1;
  }

  get endRecord(): number {
    return Math.min(this.first + this.rows, this.totalRecords);
  }
}