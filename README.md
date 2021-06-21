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


1) Start screen:

![image](https://user-images.githubusercontent.com/9286878/122693825-16610c00-d244-11eb-9d0d-cd3e7ca4cb5c.png)

2) Registered user keyboard

![image](https://user-images.githubusercontent.com/9286878/122693949-853e6500-d244-11eb-9eb1-88278527df00.png)

3) Book time slot (choose date - click to choose)

![image](https://user-images.githubusercontent.com/9286878/122694031-c9316a00-d244-11eb-9f43-e945c97a3195.png)

4) Get available time slots for chosen date. Book time slot(choose time - click to choose)

![image](https://user-images.githubusercontent.com/9286878/122694187-44931b80-d245-11eb-9981-1d90ce988cd7.png)

6) Confirm time slot to book or decline

![image](https://user-images.githubusercontent.com/9286878/122694307-9d62b400-d245-11eb-916b-47711323f93b.png)

7) Confirmation response + output of booked timeslots. To cancel some slot - just click on it

![image](https://user-images.githubusercontent.com/9286878/122694414-ec104e00-d245-11eb-8b53-5c26e74b4969.png)

8) Confirm cancellation of the time slot or decline

![image](https://user-images.githubusercontent.com/9286878/122694556-69d45980-d246-11eb-942b-a376f1e40887.png)

9) Timeslots google sheets format example

![image](https://user-images.githubusercontent.com/9286878/122694776-26c6b600-d247-11eb-97bd-e62b83ecaf87.png)

10) Users table fields:

Telegram_id: string; Phone_number: string, Telegram name + Telegram surname: string; Telegram_username: string; Registration_timestamp: Date isApproved: boolean; Nickname: string








