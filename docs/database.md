# Database Draft

## food_menus

```sql
CREATE TABLE food_menus (
  id INT PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  weather_type NVARCHAR(20) NOT NULL,
  temp_min INT NULL,
  temp_max INT NULL,
  alcohol_type NVARCHAR(20) NULL,
  tags NVARCHAR(MAX) NULL
);
```

## Future Tables

- users
- favorites
- recommendation_logs
- user_preferences
