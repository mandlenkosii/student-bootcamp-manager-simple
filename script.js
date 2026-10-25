
/*
Student Bootcamp Manager
Melsoft Academy - Module 4

This application demonstrates:
Default parameters, rest parameters, spread syntax,
closures, IIFE, functions as values, higher-order functions,
callbacks, this, call(), apply(), bind(), generators,
yield, next(), setTimeout() and asynchronous processing.
*/


// 1. IIFE: protect the application configuration.
const config = (function () {
    const bootcampName = "Melsoft Academy";
    const passingMark = 50;
    const defaultCourse = "JavaScript Development";

    return {
        bootcampName,
        passingMark,
        defaultCourse
    };
})();


// Store all students in an array.
const students = [];


// 2. GENERATOR: create unique student IDs.
function* generateStudentIds() {
    let number = 1001;

    while (true) {
        yield `STU-${number++}`;
    }
}

const studentIds = generateStudentIds();


// 3. CLOSURE: remember how many students were processed.
function createProcessingCounter() {
    let count = 0;

    return {
        increment: function () {
            count++;
            return count;
        },

        getCount: function () {
            return count;
        }
    };
}

const processingCounter = createProcessingCounter();


// 4. Calculate an average using rest parameters.
function calculateAverage(...marks) {
    if (marks.length === 0) {
        return null;
    }

    const total = marks.reduce((sum, mark) => sum + mark, 0);

    return Number((total / marks.length).toFixed(2));
}

// FUNCTIONS AS VALUES: store a function in a variable.
const averageFunction = calculateAverage;


// 5. Determine PASS or FAIL using the configured passing mark.
function determineStatus(average) {
    if (average === null) {
        return "NO MARKS";
    }

    return average >= config.passingMark ? "PASS" : "FAIL";
}


