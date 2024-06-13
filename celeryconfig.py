broker_url = "redis://localhost:6379/1"                 # queued task is stored here
result_backend = "redis://localhost:6379/2"                # once the task is complete, the result of that task is stored here
timezone = "Asia/Kolkata"
broker_connection_retry_on_startup=True