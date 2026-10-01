import type { TPaginationMeta } from '@/common/types';

type TPageQuery = Pick<TPaginationMeta, 'offset' | 'limit'>;

export class PageDto<T> {
  private constructor(
    readonly items: T[],
    private readonly total: number,
    private readonly query: TPageQuery,
  ) {}

  static of<T>(items: T[], total: number, query: TPageQuery) {
    return new PageDto(items, total, query);
  }

  get meta(): TPaginationMeta {
    const { offset, limit } = this.query;

    return {
      total: this.total,
      count: this.items.length,
      offset,
      limit,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(this.total / limit),
      hasNext: offset + this.items.length < this.total,
      hasPrevious: offset > 0,
    };
  }
}
