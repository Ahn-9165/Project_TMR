# API Draft

## GET /recommendation

```http
GET /recommendation?lat=37.5&lng=127.0&alcohol=soju
```

```json
{
  "weather": {
    "type": "Rain",
    "temp": 12,
    "humidity": 80
  },
  "recommendation": {
    "food": "해물파전",
    "drink": "막걸리",
    "reason": "비 오는 날 잘 어울리는 조합입니다."
  },
  "restaurants": []
}
```

## Backend Modules

- `weather`: calls weather provider and normalizes response
- `recommendation`: owns rule-based recommendation logic
- `restaurant`: calls Kakao/Naver/Google place search
- `users`: future authentication/profile scope
- `favorites`: saved menus and recommendation history
