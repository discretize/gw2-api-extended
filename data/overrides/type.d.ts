export type Override<T> = (id: number, item: T) => T | undefined;

export interface WithId {
  id: number;
  name?: string;
}
