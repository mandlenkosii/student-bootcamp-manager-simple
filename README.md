# Student Bootcamp Manager

## Project Description

Student Bootcamp Manager is a JavaScript application.

It allows users to register students, store their courses and
marks, calculate averages, determine PASS or FAIL, process
students asynchronously and generate a final class report.

## Features

- Student registration
- Unique student IDs
- Default course
- Multiple marks per student
- Average calculation
- PASS, FAIL and NO MARKS statuses
- Asynchronous student processing
- Class statistics and final report
- Input validation
- Automated tests

## Technologies

- HTML
- CSS
- JavaScript
- Node.js
- Node.js built-in test runner

## How to Run

1. Install Node.js.
2. Open the project folder in VS Code.
3. Open index.html using the Live Server extension.
4. Use the registration form to add students.
5. Click Process Students to process the class.
6. Click Generate Final Report to view the results.

## How to Run Tests

Open the terminal in the project folder and run:

```bash
npm test
```

## Module 4 Concepts

- Default parameters
- Rest parameters
- Spread syntax
- Closures
- IIFE
- Functions as values
- Higher-order functions
- Callbacks
- this
- call()
- apply()
- bind()
- Generator functions
- yield and next()
- Asynchronous programming
- setTimeout()

## Challenges

### Challenge 1: Handling different numbers of marks

Students can have different numbers of marks, so the average
function must support a flexible number of arguments.

### Solution

I used rest parameters to collect marks into an array and
calculated the average using reduce().

### Challenge 2: Processing students asynchronously

The application needs to process students with a delay without
blocking the rest of the JavaScript instructions.

### Solution

I used setTimeout() and callbacks to process students one at
a time. A Promise allows the application to wait for processing
to finish before updating the interface.

## Testing

The automated tests check averages, passing status, default
courses, ID uniqueness, invalid data, callbacks and reports.
