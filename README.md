# Work-It - Put your free time to good use!

This is a university project for the course "Group Project" ("Proiect colectiv")

## Usage

- Clone the project
- Cd into the project folder
- Install dependencies
- Open in Visual Studio Code (or your editor of choice)

```sh
git clone https://github.com/nesarares/work-it.git
cd work-it
npm install
code .
```

## Running the app

- To run the app on your local machine run the following command from the project's root:

```
ng serve --open
```

- Navigate to http://localhost:4200 (or add the --open flag to open for it to open automatically after compiling in browser)
- The app will reload after you save any file in the project
- It may be necessary to restart the development server after creating a new module, or importing an existing one, if the app does not recognize it

## Important!

- Before running make sure you create a file with firebase's config in **src/environments/firebaseApi.ts** with this structure:

```ts
export const firebaseConfig = {
  apiKey: 'YOUR API KEY',
  authDomain: 'YOUR AUTH DOMAIN',
  databaseURL: 'YOUR DATABASE URL',
  projectId: 'YOUR PROJECT ID',
  storageBucket: 'YOUR STORAGE BUCKET',
  messagingSenderId: 'YOUR MESSAGING SENDER ID'
};
```

- Also create an apiKeys file in **src/environments/apiKeys.ts** with this structure:

```ts
export const apiKeys = {
  mapsApiKey: 'ANGULAR MAPS API KEY'
};
```

[Angular maps](https://angular-maps.com/)

## Workflow

- For workflow / git / angular information visit [this link](https://github.com/nesarares/work-it/tree/master/docs/workflow.md)
