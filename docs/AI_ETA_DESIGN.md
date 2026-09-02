# AI ETA Engine Design

## Explainable ETA Calculation Model
The core ETA engine aims to provide farmers with a transparent and understandable waiting time. 

### Core Formula
`wait_time = tokens_ahead * avg_service_time + current_delay`

- **tokens_ahead**: Count of transactions in the queue ahead of the current token.
- **avg_service_time**: Historical moving average of time taken to process a single farmer.
- **current_delay**: Any known system delays (e.g., equipment failure, operator break).

## Future ML Enhancement
- Incorporate historical weather data to predict mandi congestion.
- Dynamically adjust `avg_service_time` based on crop type and volume.
- Use predictive modeling to suggest the best times for farmers to book slots.
