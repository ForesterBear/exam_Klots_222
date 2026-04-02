# State Design Pattern - TypeScript Implementation

## Overview

The **State Pattern** is a behavioral design pattern that allows an object to alter its behavior when its internal state changes. The object will appear to change its class.

### Pattern Concept

Instead of implementing conditional logic (if-else or switch) to handle different states, we encapsulate each possible state into separate classes. The context object delegates state-specific requests to the current state object.

### Pattern Structure

```
IState (Interface)
   ↑
   ├── State (Abstract Base Class)
   │    ├── RedState
   │    ├── YellowState
   │    ├── GreenState
   │    ├── DraftState
   │    ├── ReviewState
   │    ├── PublishedState
   │    └── ArchivedState
   │
Context (TrafficLight, Document)
```

## Key Components

### 1. **State Interface / Abstract Class** (`State.ts`)
- Defines an interface for encapsulating the behavior associated with a particular state
- Declares lifecycle methods: `onEnter()`, `onExit()`, `handle()`

```typescript
export interface IState {
  onEnter(): void;
  onExit(): void;
  handle(context: any): void;
}

export abstract class State implements IState {
  protected context?: any;
  public abstract handle(context: any): void;
}
```

### 2. **Concrete States** (`ConcreteStates.ts`)
- Implements behavior associated with a state of the Context
- Each state handles its own transitions

**Example - Traffic Light States:**
```typescript
export class RedState extends State {
  public onEnter(): void {
    console.log('🔴 RED LIGHT: STOP!');
  }
  public handle(context: any): void {
    // Transition to YellowState
    context.setState(new YellowState());
  }
}
```

### 3. **Context** (`Context.ts`)
- Defines the interface of interest to clients
- Maintains a reference to the current state
- Delegates state-specific behavior to the current state

```typescript
export class TrafficLight {
  private currentState: State;
  
  public setState(newState: State): void {
    this.currentState.onExit();
    this.currentState = newState;
    this.currentState.onEnter();
  }
  
  public request(): void {
    this.currentState.handle(this);
  }
}
```

## Project Structure

```
exam/
├── src/
│   ├── behavioral/
│   │   └── State/
│   │       ├── State.ts              # State interface and abstract base class
│   │       ├── ConcreteStates.ts     # Concrete state implementations
│   │       ├── Context.ts            # Context classes (TrafficLight, Document)
│   │       └── index.ts              # Module exports
│   └── examples/
│       └── example.ts                # Comprehensive usage examples
├── package.json                       # Project configuration
├── tsconfig.json                      # TypeScript compilation settings
├── .editorconfig                      # Editor configuration
├── .gitignore                         # Git ignore rules
└── README.md                          # Project documentation
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

```bash
# Install dependencies
npm install

# Build the TypeScript project
npm run build

# Run the compiled examples
npm start

# Or run in development mode
npm run dev

# Clean build artifacts
npm run clean
```

## Usage Examples

### Example 1: Traffic Light State Machine

```typescript
import { TrafficLight, RedState } from './src/behavioral/State';

// Create traffic light with initial red state
const trafficLight = new TrafficLight(new RedState());

// Current output:
// 🔴 RED LIGHT: STOP!
// Current State: RedState

// Request state transition
trafficLight.request();
// Output:
//    Leaving RED state...
// 🟡 YELLOW LIGHT: GET READY!
// Current State: YellowState

// Another transition
trafficLight.request();
// Output:
//    Leaving YELLOW state...
// 🟢 GREEN LIGHT: GO!
// Current State: GreenState
```

### Example 2: Document Workflow State Machine

```typescript
import { Document, State } from './src/behavioral/State';

// Define custom states
class DraftState extends State {
  public onEnter(): void {
    console.log('📝 DRAFT STATE: Document is being edited');
  }
  
  public handle(context: any): void {
    console.log('   Document submitted for review');
    context.setState(new ReviewState());
  }
}

class ReviewState extends State {
  public onEnter(): void {
    console.log('👀 REVIEW STATE: Document is under review');
  }
  
  public handle(context: any): void {
    console.log('   Document approved for publishing');
    context.setState(new PublishedState());
  }
}

// Usage
const document = new Document(new DraftState());
document.setContent('Important content');
document.request(); // Draft → Review
document.request(); // Review → Published
```

## Pattern Benefits

✅ **Single Responsibility Principle**
- Each state class has a single responsibility to handle its specific state behavior
- State logic is encapsulated and isolated

✅ **Open/Closed Principle**
- Easy to add new states without modifying existing code
- Existing states remain closed for modification
- New states are open for extension

✅ **Eliminates Complex Conditionals**
- Replaces large switch statements or cascading if-else chains
- Makes code more readable and maintainable

✅ **Clear State Transitions**
- Each state explicitly defines what transitions are possible
- State machines are easier to understand and debug

✅ **Improved Maintainability**
- State-specific logic is isolated in dedicated classes
- Changes to one state don't affect others

✅ **Easier Testing**
- Each state can be tested independently
- State transitions can be tested in isolation

## When to Use

- An object's behavior depends on its state, and it must change this behavior at runtime
- A class has large, multipart conditional statements that depend on the object's state
- State machines with complex transitions
- Workflow engines and process management systems
- You want to avoid tight coupling between state-dependent code

## When NOT to Use

- The number of states is small (< 3-4) and unlikely to change
- The state-specific logic is very simple
- High performance is critical (minimal overhead, but still present)
- State transitions are rarely needed

## Real-World Applications

1. **Traffic Light Control Systems**
   - States: Red → Yellow → Green → Red
   - Application: Traffic management, autonomous vehicles

2. **Document Workflow Management**
   - States: Draft → Review → Approved → Published → Archived
   - Application: CMS, document management systems

3. **TCP Connection States**
   - States: Closed → Listen → Established → Close Wait → Closed
   - Application: Network protocols, socket programming

4. **Media Player Controls**
   - States: Stopped → Playing → Paused → Stopped
   - Application: Audio/video players, streaming services

5. **Order Processing Systems**
   - States: Pending → Processing → Shipped → Delivered → Completed
   - Application: E-commerce, logistics systems

6. **Authentication Systems**
   - States: LoggedOut → LoggedIn → SessionExpired
   - Application: User authentication, access control

7. **Game Character States**
   - States: Idle → Running → Jumping → Falling → Dead
   - Application: Game development, animation systems

## Implementation Details

### State.ts
- Defines the `IState` interface with lifecycle methods
- Provides abstract `State` base class
- Includes context reference for state transitions

### ConcreteStates.ts
- Implements `RedState`, `YellowState`, `GreenState` for traffic lights
- Each state has its own `onEnter()`, `onExit()`, and `handle()` logic
- States manage their own transitions

### Context.ts
- `TrafficLight`: Manages traffic light state machine
  - Methods: `setState()`, `request()`, `getState()`, `getStateName()`
- `Document`: Manages document workflow state machine
  - Additional methods: `setContent()`, `getContent()`

### example.ts
- Demonstrates traffic light state machine with 3-cycle transition
- Demonstrates document workflow with 4 states
- Shows lifecycle hooks in action
- Educational output with emojis for clarity

## Design Patterns Relationship

### Similar to Strategy Pattern
- **Similarity**: Both define a family of algorithms/behaviors
- **Difference**: Strategy allows client to choose; State changes automatically
- **When to use State**: Object behavior changes based on internal state
- **When to use Strategy**: Client needs to choose different behaviors

### vs Template Method Pattern
- **Similarity**: Both define algorithm structure
- **Difference**: Template Method uses inheritance; State uses composition
- **State**: Better for complex state-dependent behavior

### Often used with Observer Pattern
- State changes can trigger observer notifications
- Useful for loosely coupled state transition notifications

## TypeScript Features Used

- **Interfaces**: `IState` defines contract for all states
- **Abstract Classes**: `State` provides base implementation
- **Inheritance**: Concrete states extend `State`
- **Generics**: Flexible context parameter handling
- **Encapsulation**: Private fields in Context and State classes
- **Type Safety**: Strict mode enabled for compile-time checking
- **Access Modifiers**: public, private, protected for proper encapsulation

## Testing Strategy

The implementation includes comprehensive examples covering:

1. **State Initialization**
   ```typescript
   const light = new TrafficLight(new RedState());
   // Automatically calls onEnter() for initial state
   ```

2. **State Transitions**
   ```typescript
   trafficLight.request(); // Triggers transition
   // Calls onExit() on current state
   // Switches to new state
   // Calls onEnter() on new state
   ```

3. **Lifecycle Hooks**
   - `onEnter()`: Called when state is activated
   - `onExit()`: Called when state is being replaced
   - `handle()`: Processes requests in current state

4. **Context Functionality**
   - State switching
   - State querying
   - Request delegation

## Run the Examples

```bash
# Build the project
npm run build

# Run compiled examples
npm start

# Output includes:
# - Traffic light cycle demonstration
# - Document workflow demonstration
# - Pattern benefits explanation
```

## File Summary

| File | Purpose |
|------|---------|
| `State.ts` | State interface and abstract base |
| `ConcreteStates.ts` | Concrete state implementations |
| `Context.ts` | TrafficLight and Document context classes |
| `index.ts` | Module exports |
| `example.ts` | Comprehensive usage examples |
| `package.json` | Project dependencies and scripts |
| `tsconfig.json` | TypeScript compiler configuration |

## Common Pitfalls to Avoid

1. **State Creating New States**
   - ✅ Good: States delegate to context's `setState()` method
   - ❌ Poor: States directly create new state instances

2. **Forgetting onExit() Cleanup**
   - ✅ Good: Clean up resources in `onExit()`
   - ❌ Poor: Missing cleanup leads to resource leaks

3. **Circular State Transitions**
   - ✅ Good: Define clear state transition rules
   - ❌ Poor: Allow invalid transitions

4. **Too Many States**
   - ✅ Good: Keep state count manageable
   - ❌ Poor: Create unnecessary intermediate states

## References

- [Design Patterns: Elements of Reusable Object-Oriented Software](https://en.wikipedia.org/wiki/Design_Patterns) - Gang of Four
- [State Pattern - Refactoring Guru](https://refactoring.guru/design-patterns/state)
- [TypeScript Official Documentation](https://www.typescriptlang.org/)
- [State Machines in Software Design](https://en.wikipedia.org/wiki/Finite-state_machine)

## License

MIT

## Author

State Pattern Implementation - Educational Project (Test 16)

---

**Created**: 2026
**Language**: TypeScript
**Pattern Type**: Behavioral Design Pattern
