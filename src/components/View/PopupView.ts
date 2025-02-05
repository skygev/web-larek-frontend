interface IPopup {
  closeButton: HTMLButtonElement; 
  content: string; 
  open(): void; 
  close(): void; 
  render(data: IPopup): HTMLElement; 
}