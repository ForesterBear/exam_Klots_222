export interface IState {
  onEnter(): void;
  onExit(): void;
  handle(context: any): void;
}

export abstract class State implements IState {
  protected context?: any;

  public setContext(context: any): void {
    this.context = context;
  }

  public onEnter(): void {}

  public onExit(): void {}

  public abstract handle(context: any): void;
}
