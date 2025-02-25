# Taskify 
A task management app that lets users sort their cluttered lives in 3 differenct categories Todo, In Progress, Done🎉

[Live Demo](https://taskify-client-sooty.vercel.app/)

## Technologies used
- React Js
- Axios
- Firebase
- Socketio


## Depnedencies Used
- @hello-pangea/dnd
- axios
- firebase
- propTypes
- socket.io-client
- react-router-dom
- sweetalret2
- eslint

## Installation Steps
- after cloning the repository
- add your firebase config key in `env.local`
```
VITE_apiKey=replace_it_with_yours
VITE_authDomain=replace_it_with_yours
VITE_projectId=replace_it_with_yours
VITE_storageBucket=replace_it_with_yours
VITE_messagingSenderId=replace_it_with_yours
VITE_appId=replace_it_with_yours
```

- then clone the backend
 ```
 git clone https://github.com/ratul0407/taskify-server.git
```

- add in the `.env` file in backend and start the server
```
DB_USER= replace_with_ur_mongodb_database_username
DB_PASS=replace_with_ur_mongdob_database_password
```
- then add the vite api url in the frontend
```
VITE_API_URL: replace_it_with_localhost_server
```

- then just simply run
```
npm install
npm run dev
```
