# Product Requirements Document: Kisan Mitra

## 1. Product Vision
Kisan Mitra is a farmer-centric procurement coordination platform designed to streamline the agricultural supply chain. It aims to eliminate long waiting times at Mandis, ensure transparent and timely payments, and provide operators with tools to efficiently manage procurement and logistics.

## 2. User Personas

### 2.1 Farmer (e.g., Ramesh Nayak)
**Goals**: Sell crops at MSP (Minimum Support Price) with minimal hassle, get accurate weighing, and receive timely payments.
**Pain Points**: Long unpredictable waits at mandis, lack of transparency in quality checks, delayed payments.

### 2.2 Operator
**Goals**: Smoothly process farmers arriving at the mandi, manage quality checks, weighing, and dispatch.
**Pain Points**: Overcrowding, dispute resolution over quality/weight, manual record-keeping errors.

### 2.3 Admin
**Goals**: Oversee multiple mandis, ensure compliance, monitor fund flow, and analyze procurement efficiency.
**Pain Points**: Lack of real-time visibility, difficult to spot bottlenecks.

## 3. Core Single Transaction Model
Every action in the system is tied to a `ProcurementTransaction`. It tracks the entire lifecycle of a farmer's visit from booking to payment settlement. 

## 4. Feature Priority Matrix
- **P0 (Critical)**: Registration, Booking Slot, Token Generation, Basic Weighing, Quality Check, Payment Generation.
- **P1 (High)**: Smart Queue Management, ETA Engine, Real-time Status Tracking, Basic Operator Dashboard.
- **P2 (Medium)**: Advanced Analytics, AI-based Quality Prediction, Exception Resolution Workflows, Mobile Notifications.

## 5. Exception Handling
Exceptions (e.g., quality rejection, weight mismatch, payment failure) are logged as part of the transaction history and require operator/admin intervention depending on severity.

## 6. Smart Queue Requirement
Dynamic queue generation based on token numbers. ETA is dynamically updated based on current processing speeds and the number of tokens ahead.
