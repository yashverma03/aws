export class Pagination {
  readonly page: number;
  readonly limit: number;
  readonly totalCount: number;
  readonly lastPage: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor(page: number, limit: number, count: number) {
    this.page = page;
    this.limit = limit;
    this.totalCount = count;
    this.lastPage = Math.ceil(this.totalCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.lastPage;
  }

  static calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }
}
