Ok let's build a web app using javascript (no typescript), svelte 5, tailwind 4, mongodb and redis. The project is named "poezik" and is a performance workshop booking system.
The workshop happens periodically, each time with different teachers and participants. There's is no teacher user, every user can teach on a workshop, but only 2 teachers can be selected for each event.
Some user have an admin flag, they can do anything on the app, like edit events, teachers and participants.
We have a predifined list of date for the events.
Each event has :

- a title
- a description
- a date
- 2 people from user to teach
- 14 participants
- A waiting list
  Title and description are editable by assigned teachers and admin. participant can register and unregister to any event.
  If there's already 14 participants, there is a waiting list for each event.
  People (user) identifies themself with an email address,They get a magiclink managed in vercel kv , the first time they give a name and optionnaly a photo, the magiclink expire after 15 days.
  Mongodb whould have : users, events collections.
  The landing page for registered user has a title and a little text.
  Below a responsive carrousel of vertical cards (number of cards visible depends on screen width) the first visible card is the next event.
  if user is a teacher on the event, he can edit title and description.
  if he's a participant he can book and unbook himself for the event, and if the event is full, he can join the waiting list. participant are recorded in registering order.
  if he's an admin, he can do anything : edit event, teachers, participants.
  Project should kept simple, very easy to use and focus on the main functionalities.
