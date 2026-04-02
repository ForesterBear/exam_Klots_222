import { TrafficLight, RedState, YellowState, GreenState, Document, State } from '../behavioral/State';

console.log('═══════════════════════════════════════════════════════════');
console.log('       STATE DESIGN PATTERN - TRAFFIC LIGHT EXAMPLE');
console.log('═══════════════════════════════════════════════════════════\n');


const trafficLight = new TrafficLight(new RedState());

console.log(`Current State: ${trafficLight.getStateName()}`);
trafficLight.request();

console.log(`\nCurrent State: ${trafficLight.getStateName()}`);
trafficLight.request();

console.log(`\nCurrent State: ${trafficLight.getStateName()}`);
trafficLight.request();

console.log(`\nCurrent State: ${trafficLight.getStateName()}`);

console.log('\n═══════════════════════════════════════════════════════════');
console.log('      STATE DESIGN PATTERN - DOCUMENT STATE EXAMPLE');
console.log('═══════════════════════════════════════════════════════════\n');

class DraftState extends State {
  public onEnter(): void {
    console.log('📝 DRAFT STATE: Document is being edited');
  }

  public onExit(): void {
    console.log('   Leaving DRAFT state...');
  }

  public handle(context: any): void {
    if (context && typeof context.setState === 'function') {
      console.log('   Document submitted for review');
      context.setState(new ReviewState());
    }
  }
}

class ReviewState extends State {
  public onEnter(): void {
    console.log('👀 REVIEW STATE: Document is under review');
  }

  public onExit(): void {
    console.log('   Leaving REVIEW state...');
  }

  public handle(context: any): void {
    if (context && typeof context.setState === 'function') {
      console.log('   Document approved for publishing');
      context.setState(new PublishedState());
    }
  }
}

class PublishedState extends State {
  public onEnter(): void {
    console.log('✅ PUBLISHED STATE: Document is published');
  }

  public onExit(): void {
    console.log('   Leaving PUBLISHED state...');
  }

  public handle(context: any): void {
    if (context && typeof context.setState === 'function') {
      console.log('   Document archived');
      context.setState(new ArchivedState());
    }
  }
}

class ArchivedState extends State {
  public onEnter(): void {
    console.log('🗂️  ARCHIVED STATE: Document is archived');
  }

  public onExit(): void {
    console.log('   Leaving ARCHIVED state...');
  }

  public handle(context: any): void {
    console.log('   Document is archived and cannot transition further');
  }
}

const document = new Document(new DraftState());
document.setContent('This is my important document');

console.log(`Current State: ${document.getStateName()}`);
console.log(`Content: "${document.getContent()}"\n`);

document.request();

console.log(`\nCurrent State: ${document.getStateName()}\n`);
document.request();

console.log(`\nCurrent State: ${document.getStateName()}\n`);
document.request();

console.log(`\nCurrent State: ${document.getStateName()}\n`);

console.log('\n═══════════════════════════════════════════════════════════');
console.log('                    PATTERN BENEFITS');
console.log('═══════════════════════════════════════════════════════════');
console.log(`
1. Single Responsibility Principle:
   - Each state class handles its own behavior

2. Open/Closed Principle:
   - Easy to add new states without modifying existing code

3. Simplifies Complex Conditionals:
   - Eliminates large if-else or switch statements

4. Makes State Transitions Clear:
   - Each state explicitly defines possible transitions

5. Improves Code Maintainability:
   - State-specific logic is isolated in dedicated classes
`);
console.log('═══════════════════════════════════════════════════════════\n');
