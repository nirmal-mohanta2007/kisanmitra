# User Flows

## 1. Ramesh Nayak Hero Journey (Sequence Diagram)
```mermaid
sequenceDiagram
    participant Farmer
    participant App
    participant MandiOperator
    participant Backend

    Farmer->>App: Books slot for crop sale
    App->>Backend: POST /bookings
    Backend-->>App: Booking Confirmed (Token #)
    Farmer->>App: Arrives at Mandi, Checks in
    App->>Backend: Generate Queue Position
    Backend-->>App: ETA Provided
    MandiOperator->>App: Calls Token for Quality Check
    App->>Backend: Update Status (QUALITY_CHECK)
    MandiOperator->>App: Performs Weighing
    App->>Backend: Update Status (WEIGHING)
    App->>Backend: Generate Payment
    Backend-->>App: Payment Sent to Bank
    App-->>Farmer: Notification: Payment Successful
```

## 2. Exception Resolution Flow
1. **Detection**: Operator flags an issue (e.g., high moisture in crop).
2. **Hold State**: Transaction moves to an exception state.
3. **Admin Review**: Admin reviews the dispute via dashboard.
4. **Resolution**: Admin either rejects the crop or approves with a penalty.
5. **Resume**: Transaction resumes or is marked as rejected.
