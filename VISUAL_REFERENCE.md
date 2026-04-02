# 🎨 State Design Pattern - Visual Reference

## Pattern Class Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         IState                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ + onEnter(): void                                     │  │
│  │ + onExit(): void                                      │  │
│  │ + handle(context: any): void                          │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ implements
                     │
        ┌────────────┴─────────────┬─────────────┬──────────────┐
        │                          │             │              │
        │                          │             │              │
    ┌───▼───────────┐  ┌──────────▼────┐  ┌────▼────────┐ ┌────▼───────────┐
    │   RedState    │  │  YellowState  │  │ GreenState  │ │   DraftState   │
    ├───────────────┤  ├───────────────┤  ├─────────────┤ ├────────────────┤
    │ + onEnter()   │  │ + onEnter()   │  │ + onEnter() │ │ + onEnter()    │
    │ + onExit()    │  │ + onExit()    │  │ + onExit()  │ │ + onExit()     │
    │ + handle()    │  │ + handle()    │  │ + handle()  │ │ + handle()     │
    └───────────────┘  └───────────────┘  └─────────────┘ └────────────────┘
        │                  │                & More States...
        │                  │
        │◄─────────────────┤
        │                  │
        └──────────────────┴──────────────────┐
                                              │
                                    ┌─────────▼──────────┐
                                    │    Context         │
                                    ├──────────────────┐ │
                                    │ - currentState   │ │
                                    ├──────────────────┤ │
                                    │ + setState()     │ │
                                    │ + request()      │ │
                                    │ + getState()     │ │
                                    │ + getStateName() │ │
                                    └──────────────────┘ │
                                  (TrafficLight, Document)
                                    └────────────────────┘
```

---

## State Transition Diagrams

### Traffic Light Example

```
┌─────────────────────────────────────────────────────────┐
│                  TRAFFIC LIGHT CYCLE                    │
└─────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │   RedState   │
                    │   🔴 STOP    │
                    └──────┬───────┘
                           │
                     request()
                    (30 seconds)
                           │
                    ┌──────▼───────┐
                    │ YellowState  │
                    │🟡 GET READY  │
                    └──────┬───────┘
                           │
                     request()
                    (5 seconds)
                           │
                    ┌──────▼───────┐
                    │ GreenState   │
                    │   🟢 GO      │
                    └──────┬───────┘
                           │
                     request()
                    (25 seconds)
                           │
                    ┌──────▼───────┐
                    │   RedState   │
                    │   🔴 STOP    │
                    └──────────────┘
                           ▲
                           │
                        (cycle)
```

### Document Workflow Example

```
┌─────────────────────────────────────────────────────────┐
│               DOCUMENT STATE MACHINE                    │
└─────────────────────────────────────────────────────────┘

              ┌──────────────────┐
              │   DraftState     │
              │   📝 DRAFT       │ ◄──┐
              │  (being edited)  │    │
              └────────┬─────────┘    │
                       │              │
                 request()            │
              (submit for review)     │
                       │              │
              ┌────────▼──────────┐   │
              │  ReviewState      │   │
              │  👀 REVIEW        │   │
              │  (under review)   │   │
              └────────┬──────────┘   │
                       │              │
                 request()            │
              (approve for publish)   │
                       │              │
              ┌────────▼────────────┐ │
              │ PublishedState      │ │
              │ ✅ PUBLISHED        │ │
              │ (published online)  │ │
              └────────┬────────────┘ │
                       │              │
                 request()            │
                  (archive)           │
                       │              │
              ┌────────▼────────────┐ │
              │  ArchivedState      │ │
              │  🗂️ ARCHIVED        │ │
              │ (archived, read-only)│ │
              └─────────────────────┘ │
                       │              │
                  Cannot transition   │
                   (stays in archive) │
                                      │
            (Manual revert can be     │
             implemented if needed)   │
```

---

## Sequence Diagram - State Transition

```
┌----------------────────┐         ┌──────────────┐         ┌──────────────┐
│      Client           │         │   Context    │         │   State      │
│    (TrafficLight)     │         │              │         │              │
└────────┬──────────────┘         └──────┬───────┘         └────────┬──────┘
         │                               │                         │
         │  setState(newState)           │                         │
         ├──────────────────────────────►│                         │
         │                               │                         │
         │                               │ currentState.onExit()   │
         │                               ├────────────────────────►│
         │                               │                         │
         │                               │◄─ return               │
         │                               │                         │
         │                               │ newState.setContext()   │
         │                               ├────────────────────────►│
         │                               │                         │
         │                               │◄─ return               │
         │                               │                         │
         │                               │ newState.onEnter()      │
         │                               ├────────────────────────►│
         │                               │                         │
         │                               │◄─ return               │
         │                               │                         │
         │◄─ return                      │                         │
         │                               │                         │
         │  request()                    │                         │
         ├──────────────────────────────►│                         │
         │                               │                         │
         │                               │ currentState.handle()   │
         │                               ├────────────────────────►│
         │                               │                         │
         │                               │◄─ return               │
         │                               │ (may trigger setState)  │
         │◄─ return                      │                         │
         │                               │                         │
```

---

## TypeScript Implementation Flow

```
┌─────────────────────────────────────────────────────────────┐
│           STATE PATTERN INSTANTIATION FLOW                  │
└─────────────────────────────────────────────────────────────┘

1️⃣  CREATE INITIAL STATE
   ┌──────────────────────┐
   │  const light         │
   │  = new TrafficLight( │
   │    new RedState()    │
   │  )                   │
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐
   │ Constructor runs:    │
   │ currentState =       │
   │   RedState           │
   │ setContext(this)     │
   │ onEnter() → prints   │
   │   "🔴 RED LIGHT"     │
   └──────────┬───────────┘
              │
2️⃣  REQUEST STATE TRANSITION
              │
              ▼
   ┌──────────────────────┐
   │ light.request()      │
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐
   │ currentState         │
   │  .handle(this)       │
   │ → onExit() called    │
   │ → setState() called  │
   │   with YellowState   │
   │ → onEnter() called   │
   │   on new state       │
   └──────────┬───────────┘
              │
3️⃣  STATE CHANGED
              │
              ▼
   ┌──────────────────────┐
   │ Current state is now │
   │ YellowState          │
   │ Prints:              │
   │ "🟡 YELLOW LIGHT"    │
   └──────────────────────┘
```

---

## Key Concepts Visualization

```
┌──────────────────────────────────────────────────────────┐
│           PATTERN KEY PRINCIPLES                          │
└──────────────────────────────────────────────────────────┘

1. ENCAPSULATION
   ┌─────────────────────────────────────────────┐
   │ Each state encapsulates its own behavior    │
   │                                             │
   │ ❌ If-else soup:                            │
   │    if (state === 'RED') { STOP }           │
   │                                             │
   │ ✅ State classes:                           │
   │    RedState { handle() { STOP } }          │
   └─────────────────────────────────────────────┘

2. SINGLE RESPONSIBILITY
   ┌─────────────────────────────────────────────┐
   │ Each state class has ONE responsibility     │
   │                                             │
   │ RedState → RedState behavior               │
   │ YellowState → YellowState behavior         │
   │ GreenState → GreenState behavior           │
   └─────────────────────────────────────────────┘

3. OPEN/CLOSED PRINCIPLE
   ┌─────────────────────────────────────────────┐
   │ Open for extension:                         │
   │   Add new states by creating new classes   │
   │                                             │
   │ Closed for modification:                   │
   │   Existing states/context unchanged        │
   └─────────────────────────────────────────────┘

4. CONTEXT DELEGATION
   ┌─────────────────────────────────────────────┐
   │ Context doesn't know state details          │
   │ Just delegates to current state object      │
   │                                             │
   │ context.request() → currentState.handle()  │
   └─────────────────────────────────────────────┘
```

---

## Type System Visualization

```
┌─────────────────────────────────────────────────────┐
│         TYPESCRIPT TYPE SAFETY LAYER                │
└─────────────────────────────────────────────────────┘

interface IState {
  onEnter(): void;
  onExit(): void;
  handle(context: any): void;
}

abstract class State implements IState {
  protected context?: any;
  public setContext(context: any): void { ... }
  public onEnter(): void { ... }
  public onExit(): void { ... }
  public abstract handle(context: any): void;
}

class RedState extends State {
  public handle(context: any): void {
    // Type-checked implementation
  }
}

class TrafficLight {
  private currentState: State;  // ◄─── Type-safe state reference
  
  public setState(newState: State): void {  // ◄─── Type-safe setter
    // ...
  }
}
```

---

## Real vs Anti-Pattern

```
┌─────────────────────────────────────────────────────┐
│     ❌ ANTI-PATTERN (Before State Pattern)          │
└─────────────────────────────────────────────────────┘

class TrafficLight {
  state = 'RED';
  
  request() {
    if (this.state === 'RED') {
      console.log('STOP');
      this.state = 'YELLOW';
    } else if (this.state === 'YELLOW') {
      console.log('GET READY');
      this.state = 'GREEN';
    } else if (this.state === 'GREEN') {
      console.log('GO');
      this.state = 'RED';
    }
  }
}
Problems: ❌ Hard to maintain
          ❌ Hard to extend
          ❌ Mixed concerns
          ❌ Difficult testing


┌─────────────────────────────────────────────────────┐
│      ✅ STATE PATTERN (After Refactoring)           │
└─────────────────────────────────────────────────────┘

class TrafficLight {
  private currentState: State = new RedState();
  
  setState(state: State) {
    this.currentState.onExit();
    this.currentState = state;
    this.currentState.onEnter();
  }
  
  request() {
    this.currentState.handle(this);
  }
}

class RedState extends State {
  handle(context: TrafficLight) {
    console.log('STOP');
    context.setState(new YellowState());
  }
}

Benefits: ✅ Easy to maintain
         ✅ Easy to extend
         ✅ Clear separation
         ✅ Easy to test
```

---

## Memory Management Lifecycle

```
┌─────────────────────────────────────────────────────┐
│       STATE OBJECT LIFECYCLE                        │
└─────────────────────────────────────────────────────┘

1. CREATION
   ┌─────────────────────────────────────┐
   │ new RedState()                      │
   │ → Object allocated in memory        │
   │ → Constructor called                │
   └─────────────────────────────────────┘
                    │
                    ▼
2. ACTIVATION
   ┌─────────────────────────────────────┐
   │ context.setState(redState)          │
   │ → onEnter() called                  │
   │ → State is now active               │
   └─────────────────────────────────────┘
                    │
                    ▼
3. DEACTIVATION
   ┌─────────────────────────────────────┐
   │ context.setState(yellowState)       │
   │ → onExit() called on RedState       │
   │ → Cleanup happens                   │
   └─────────────────────────────────────┘
                    │
                    ▼
4. GARBAGE COLLECTION
   ┌─────────────────────────────────────┐
   │ When no more references exist       │
   │ → Object is garbage collected       │
   │ → Memory freed                      │
   └─────────────────────────────────────┘
```

---

## Files at a Glance

```
├── State.ts
│   │
│   ├── IState interface
│   │   ├── onEnter()
│   │   ├── onExit()
│   │   └── handle()
│   │
│   └── State abstract class
│       ├── implements IState
│       ├── setContext(context)
│       └── Concrete classes extend this
│
├── ConcreteStates.ts
│   ├── RedState
│   ├── YellowState
│   ├── GreenState
│   └── (DraftState, ReviewState, etc. in examples)
│
├── Context.ts
│   ├── TrafficLight
│   │   ├── setState()
│   │   ├── request()
│   │   └── lifecycleManagement
│   │
│   └── Document
│       ├── setState()
│       ├── request()
│       ├── contentManagement
│       └── workflowManagement
│
└── example.ts
    ├── TrafficLight demo
    ├── Document workflow demo
    └── Educational output
```

---

**Pattern Status**: ✅ Complete & Well-Visualized
**Learning Value**: ⭐⭐⭐⭐⭐
**Production Ready**: ✅ Yes
