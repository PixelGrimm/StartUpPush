# Monthly Boost Sales Reset - Cron Job Setup

## Overview
This guide explains how to set up an automated cron job to reset monthly boost sales at 00:00:01 UK time on the 1st of each month.

## Cron Job Command

### For Linux/Mac (crontab)
```bash
# Edit crontab
crontab -e

# Add this line to run at 00:00:01 UK time on the 1st of each month
1 0 1 * * cd /path/to/your/StartUpPush && node scripts/reset-monthly-sales.js >> /var/log/boost-reset.log 2>&1
```

### For Windows (Task Scheduler)
1. Open Task Scheduler
2. Create Basic Task
3. Name: "Monthly Boost Sales Reset"
4. Trigger: Monthly, 1st day of month, at 00:00:01
5. Action: Start a program
6. Program: `node`
7. Arguments: `scripts/reset-monthly-sales.js`
8. Start in: `C:\path\to\your\StartUpPush`

### For Docker/Containerized Environments
```bash
# Add to your Dockerfile or deployment script
echo "1 0 1 * * cd /app && node scripts/reset-monthly-sales.js" | crontab -
```

## Manual Reset
To manually reset sales for testing:
```bash
cd /path/to/your/StartUpPush
node scripts/reset-monthly-sales.js
```

## Logging
The script will output:
- Current UK time
- Number of records reset
- Current monthly status for each plan type

## Time Zone Notes
- The script automatically converts to UK time (Europe/London)
- Handles both GMT (winter) and BST (summer) automatically
- Reset happens at exactly 00:00:01 UK time regardless of server timezone

## Verification
After setup, you can verify the cron job is working by:
1. Checking the log file: `tail -f /var/log/boost-reset.log`
2. Testing the API: `curl http://localhost:3000/api/boost/sales`
3. Checking the boost page shows updated availability
