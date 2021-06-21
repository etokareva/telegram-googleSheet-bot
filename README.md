# telegram-googleSheet-bot
Registration for services bot

1. The Bot communicates only with white list of users.
  Every user can ask for being added to this list by clicking on registration button in user interface keyboard, but only the admin decides to approve this user or not.
  Admin gets notification for approve after user request for it.
  User gets notification about admin's approve or approve decline

2. The Bot schedules creating of new google sheet every day and deletes old sheets also on schedule

3. The Bot allows user to: 
  - be registered in the system,
  - set displayed names (but not edit it), 
  - get all free available time slots to be registered for the service
  - get his(her) reserved slots
  - reserve slots
  - cancel reserved slots

3. Bot has programmed limits(could be updated depending on requirements): 
 - there is max 3 slots for user a day
 - reserve for today(only time  > now), tomorrow and day after tomorrow
 - cancel not less than 2 hours before the reservation time slot
 - reserve for today starts in 8:45

