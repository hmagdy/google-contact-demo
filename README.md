# google-contact-demo

### Backend Demo:

- add credentials.json

- run: `node api.js`

- make sure you are using an email with admin access for Admin directory SDK

### Frontend Demo:

- add credentials.json

- run: `npx http-server -p 3000`

- make sure you are using an email with admin access for Admin directory SDK

- Go to http://localhost:3000/frontend-demo/contact-users and authorize a workspace user

### Google services used:

- [People API](https://developers.google.com/people) -> To Access authenticated user [Contacts](https://contacts.google.com/) (Does not have access for Workspace contacts)

- [Directory API](https://developers.google.com/admin-sdk/directory/v1/guides) -> To access authenticated workspace user with admin role data
