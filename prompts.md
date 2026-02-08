Simple filters are suported by the backend as follows:
Simple filtering
   Uses parameters, field[op]=value, with a match={all|any} parameter to "and" or "or" all together.
   valid op values for strings are: contains, doesNotcontain, eq, ne, startsWith, endsWith, isEmpty, isNotEmpty
   valid op values for numbers are: eq, ne, gt, gte, lt, lte
   valid op values for dates, times and timestamps are: eq, ne, gt, gte, lt, lte
   Example: GET /api/v1/properties?registration[contains]=454123-000&firstDate[ge]=20260202&match=all