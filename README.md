# Kibu Technical Project

Welcome to the Kibu Technical Project portion of the interview! Congratulations for making it this far. This project should take between 2-3 hours to complete. Please read this complete file before starting.

## Overview

The admin tooling features of Kibu are a large part of our product. In this project you will create a basic implementation of viewing and creating notes for a user. You will create a basic react front end which connects to a simple backend containing users and notes.

## Specification

Your solution must include the following:

1. Utilize React, TypeScript, and [NextJs using the App Router](https://nextjs.org/docs/app/getting-started/installation)
2. A page to list all users and their respective notes
3. Ability to create a new note for a user

We highly recommend including the following:

1. Using [tRPC](https://trpc.io/docs/quickstart) for client calls. We _highly_ highly recommend using this.
2. Using [NextJs Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

If time allows the following are nice to have features:

1. Add a new field to note called `timestamp` which tracks the current time when saved
2. Ability to update a note
3. Add a new resource in the backend called `audit_log` which tracks changes when a note is updated

The following can be considered out of scope:

1. Authorization, authentication, and security of the backend server

## Backend Server

To help with your implementation we have provided a way to easily use a backend server with the `json-server` package. First install the `json-server` package with

```
npm install -g json-server
```

Then start the server using

```
json-server --watch db.json
```

You should see the following output in your terminal

```
Index:
http://localhost:3000/

Static files:
Serving ./public directory if it exists

Endpoints:
http://localhost:3000/members
http://localhost:3000/notes
```

This will create GET, POST, PUT, PATCH, and DELETE routes for both `/members` and `/notes`.

You can learn more about `json-server` [here](https://www.npmjs.com/package/json-server/v/0.16.1)

## Getting Started

To complete this project you will not need to make any changes to the `json-server`. Therefore, to get started you should create a new NextJs App. You can learn more from the [NextJs Docs](https://nextjs.org/docs/app/getting-started/installation)

## Scoring

You will be scored on:

1. Using required frameworks (NextJs with the App router, React, and TypeScript)
2. Code functionality
3. Code quality
4. Thoughtful design and UI
5. Documentation on any design decisions or libraries used

Bonus points for:

1. Using server components in NextJs
2. Using [tRPC](https://trpc.io/docs/quickstart)

## Help

Please feel free to reach out to Ben for any questions or help while completing this project! The fastest way to get in touch with him is via text message.

This is not an exam, so use any tools at your disposable which you would normally use. At Kibu we use [Cursor](https://www.cursor.com/), check it out if you're not already using it!

Here are some other helpful hints:
1. If you're newer to NextJs, they migrated from the "pages router" to the "app router". At Kibu we use the app router, so just be sure when checking resources online or the NextJs docs that you select "Using app router" from the dropdown in the top left of the NextJs docs.
2. tRPC utilizes React Query under the hood. It makes it incredibly easy to build APIs with types included. It also makes the transition to using server components seamless. You can get started [here](https://trpc.io/docs/quickstart)
3. Follow [this guide](https://nextjs.org/docs/app/getting-started/installation) to learn how to set up a new NextJs app. Both [cursor](https://www.cursor.com/) and Chat GPT are really helpful here too!

## Submission

You will submit your code via GitHub (or your git repository of preference) and email the link to [ben@kibuhq.com](mailto:ben@kibuhq.com). Your Git repo should include documentation on how to run your application locally.

Feel free to reach out to ask followup questions or clarify any requirements.
