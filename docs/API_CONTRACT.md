# API Contract

## Base URL
`/api/v1`

## 1. Mandis
- `GET /mandis`: List all active mandis.
- `GET /mandis/:id`: Get details of a specific mandi.

## 2. Bookings
- `POST /bookings`: Create a new booking slot for a farmer.
  - Payload: `{ farmer_id, mandi_id, expected_date }`
- `GET /bookings/:id`: Retrieve booking details.

## 3. Queue Management
- `GET /queue/mandi/:id`: Get current queue status for a mandi.
- `POST /queue/token`: Generate a token for check-in.

## 4. Procurement Transactions
- `GET /procurement/:id`: Get full transaction lifecycle details.
- `PATCH /procurement/:id/status`: Advance the state machine.
  - Payload: `{ new_status, metadata }`

## 5. Payments
- `GET /payments/:id`: Get payment status.
- `POST /payments/:id/process`: Trigger payment settlement.
