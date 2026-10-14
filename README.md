# Student Study Planner Frontend

This repository contains the static HTML, CSS, and JavaScript frontend.

## Local use

Run the Spring Boot backend at `http://localhost:8080`, then open `index.html` with a local static web server such as VS Code Live Server.

## GitHub Pages

In the repository's **Settings > Pages**, publish branch `main` from `/(root)`. The site URL will be:

`https://kandhalavarshithareddy-alt.github.io/student-study-planner-frontend/`

Before publishing, set `window.STUDY_PLANNER_API_URL` in `config.js` to the backend's public base URL, without `/api/tasks`. GitHub Pages serves static files, so the API URL is configured in this file rather than as a hosting environment variable.