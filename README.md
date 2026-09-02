# Kisan Mitra

Kisan Mitra is a farmer-centric procurement coordination platform designed to streamline the agricultural supply chain. Built with Expo SDK 57, Expo Router, and React Native, it aims to eliminate long waiting times at Mandis and ensure transparent and timely payments.

## Key Features
- **Smart Queue Management**: Dynamic queue generation and ETA prediction.
- **Transparent Procurement**: Clear visibility into weighing, quality checks, and pricing.
- **Robust State Machine**: Ensures transactions follow strict, reliable paths.

## Tech Stack
- React Native & Expo SDK 57
- Expo Router
- TypeScript (Strict Mode)

## Project Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Environment:
Copy `.env.example` to `.env` and adjust the variables as needed.

3. Start the application:
```bash
npx expo start
```

## Architecture
Please refer to `docs/TECHNICAL_ARCHITECTURE.md` for in-depth details on our Domain Model, State Machine, and ETA Engine design. 

## Documentation
- [Product Requirements](docs/PRODUCT_REQUIREMENTS.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [API Contract](docs/API_CONTRACT.md)
- [AI ETA Design](docs/AI_ETA_DESIGN.md)
- [User Flows](docs/USER_FLOWS.md)
- [Demo Script](docs/DEMO_SCRIPT.md)
