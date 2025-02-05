interface IModel<T> {
  emitChanges(event: string, payload?: object): void; 
}