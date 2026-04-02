import { State } from './State';

export class RedState extends State {
  public onEnter(): void {
    console.log('🔴 RED LIGHT: STOP!');
  }

  public onExit(): void {
    console.log('   Leaving RED state...');
  }

  public handle(context: any): void {
    if (context && typeof context.setState === 'function') {
      console.log('   Red signal duration: 30 seconds');
      context.setState(new YellowState());
    }
  }
}

export class YellowState extends State {
  public onEnter(): void {
    console.log('🟡 YELLOW LIGHT: GET READY!');
  }

  public onExit(): void {
    console.log('   Leaving YELLOW state...');
  }

  public handle(context: any): void {
    if (context && typeof context.setState === 'function') {
      console.log('   Yellow signal duration: 5 seconds');
      context.setState(new GreenState());
    }
  }
}

export class GreenState extends State {
  public onEnter(): void {
    console.log('🟢 GREEN LIGHT: GO!');
  }

  public onExit(): void {
    console.log('   Leaving GREEN state...');
  }

  public handle(context: any): void {
    if (context && typeof context.setState === 'function') {
      console.log('   Green signal duration: 25 seconds');
      context.setState(new RedState());
    }
  }
}
