export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  create(item: Partial<T>): Promise<T>;
}

