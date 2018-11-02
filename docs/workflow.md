# Workflow

## Tools

- [Visual Studio Code (recommended)](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)
- [NodeJS (8+)](https://nodejs.org/en/)

## VSCode extensions

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [TypeScript Hero](https://marketplace.visualstudio.com/items?itemName=rbbit.typescript-hero)
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) - optional

## Development

- When working on a new feature / task

```sh
git checkout master
git pull
git checkout -b your-task-name

... after some work

git add .
git commit -m "Your commit message"
git push
```

- When first time pushing the branch run:

```sh
git push -u origin your-task-name
```

- After finishing the task:
  - Pull eventual changes from the master branch
  ```sh
  git pull origin master
  ```
  - Resolve merge conflicts if they exist (you can use any tool, like WebStorm, IntellIJ or Beyond Compare)
  - To resolve conflicts in WebStorm / IntellIJ open the project, then _VCS -> Git -> Resolve conflicts_ and resolve for each file
  - If there were conflicts, run again
  ```sh
  git add .
  git commit -m "Fix merge conflicts"
  git push
  ```
  - Create a pull request on github **from your branch to master**

## VSCode settings

_Open File -> Preferences -> Settings. Click on the three dots -> Open settings.json_

```js
{
  // do not modify other code styling settings

  "editor.tabSize": 2,
  "editor.insertSpaces": false,
  "editor.formatOnSave": true,

  "[html]": {
    "editor.quickSuggestions": {
      "other": true,
      "comments": false,
      "strings": true
    }
  },

  "typescript.preferences.quoteStyle": "single",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "javascript.preferences.quoteStyle": "single",
  "prettier.singleQuote": true,

  // optional

  "editor.wordWrap": "on",
  "editor.mouseWheelZoom": true,
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
  "window.titleBarStyle": "custom",
  "window.zoomLevel": 0,
  "window.menuBarVisibility": "default",
  "breadcrumbs.enabled": true,
  "editor.fontSize": 16
}
```
