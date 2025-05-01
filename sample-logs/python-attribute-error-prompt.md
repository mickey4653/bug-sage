## Error Details
- Type: Error
- Message: 'NoneType' object has no attribute 'price'

## Raw Logs
```
Traceback (most recent call last):
  File "app.py", line 42, in <module>
    result = calculate_total(items)
  File "utils/math.py", line 15, in calculate_total
    return sum([item.price for item in items])
AttributeError: 'NoneType' object has no attribute 'price'
```
