# Technical Architecture

## 1. Tech Stack Overview
- **Framework**: Expo SDK 57, React Native
- **Routing**: Expo Router for file-based routing
- **Language**: TypeScript (strict mode)
- **State Management**: React Context + useReducer (`src/store/`)
- **Domain Logic**: Handled in `src/services/`
- **Typing**: `src/types/` for all domain models

## 2. Domain Model Architecture
The central object is `ProcurementTransaction`. It is heavily typed using TypeScript unions and discriminated types to ensure that invalid states cannot be represented.

## 3. Finite State Machine (FSM)
All transaction state changes must go through the `TransactionStateMachine`.
Transitions: `BOOKED` -> `CHECK_IN` -> `QUALITY_CHECK` -> `WEIGHING` -> `PAYMENT_PENDING` -> `COMPLETED`.
Direct state mutation is disallowed.

## 4. ETA Engine Math
The ETA calculation is based on simple queueing theory:
`wait_time = tokens_ahead * avg_service_time + current_delay`

## 5. Data Flow & Store
1. Components dispatch actions or call services.
2. Services compute the result and trigger state machine transitions.
3. The Store (`useReducer`) captures the updated domain state.
4. UI re-renders based on Store Context updates.
