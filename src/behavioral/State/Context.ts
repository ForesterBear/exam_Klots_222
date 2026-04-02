import { State } from './State';

export class TrafficLight {
  private currentState: State;

  constructor(initialState: State) {
    this.currentState = initialState;
    this.currentState.setContext(this);
    this.currentState.onEnter();
  }

  public setState(newState: State): void {
    if (this.currentState) {
      this.currentState.onExit();
    }
    this.currentState = newState;
    this.currentState.setContext(this);
    this.currentState.onEnter();
  }

  public getState(): State {
    return this.currentState;
  }

  public request(): void {
    this.currentState.handle(this);
  }

  public getStateName(): string {
    return this.currentState.constructor.name;
  }
}

export class Document {
  private currentState: State;
  private content: string = '';

  constructor(initialState: State) {
    this.currentState = initialState;
    this.currentState.setContext(this);
    this.currentState.onEnter();
  }

  public setState(newState: State): void {
    if (this.currentState) {
      this.currentState.onExit();
    }
    this.currentState = newState;
    this.currentState.setContext(this);
    this.currentState.onEnter();
  }

  public getState(): State {
    return this.currentState;
  }

  public request(): void {
    this.currentState.handle(this);
  }

  public setContent(content: string): void {
    this.content = content;
  }

  public getContent(): string {
    return this.content;
  }

  public getStateName(): string {
    return this.currentState.constructor.name;
  }
}
