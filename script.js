
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

// 6. Register a student.
// Default parameters supply the course when it is undefined.
// Rest parameters allow any number of marks.
function registerStudent(
    name,
    course = config.defaultCourse,
    ...marks
) {
    if (typeof name !== "string" || name.trim() === "") {
        return "Please enter a valid student name.";
    }

    if (typeof course !== "string" || course.trim() === "") {
        return "Please enter a valid course.";
    }

    const invalidMarks = marks.some(mark =>
        typeof mark !== "number" ||
        !Number.isFinite(mark) ||
        mark < 0 ||
        mark > 100
    );

    if (invalidMarks) {
        return "Marks must be numbers between 0 and 100.";
    }

    // Use the generator's next() method to get an ID.
    const id = studentIds.next().value;

    // Spread syntax copies the marks into a new array.
    const student = {
        id: id,
        name: name.trim(),
        course: course.trim(),
        marks: [...marks],
        average: averageFunction(...marks),
        status: determineStatus(averageFunction(...marks)),
        processed: false
    };

    students.push(student);

    return `${student.name} registered successfully. ID: ${student.id}`;
}

// 7. this: an object method uses its own properties.
const studentTools = {
    describe: function () {
        return `${this.name} - ${this.course}`;
    }
};


// 8. Higher-order function: accept another function.
function runWithCallback(student, callback) {
    callback(student);
}

// 9. Display students in the HTML table.
function displayStudents() {
    const table = document.getElementById("studentTable");
    table.innerHTML = "";

    students.forEach(student => {
        const row = table.insertRow();

        // Use call() to set this to the current student.
        const describeStudent = studentTools.describe.call(student);

        const values = [
            student.id,
            student.name,
            student.course,
            student.marks.length ? student.marks.join(", ") : "No marks",
            student.average === null ? "N/A" : student.average,
            student.status
        ];

        values.forEach((value, index) => {
            const cell = row.insertCell();
            cell.textContent = value;

            if (index === 1) {
                cell.title = describeStudent;
            }

            if (index === 5) {
                if (student.status === "PASS") {
                    cell.className = "pass";
                } else if (student.status === "FAIL") {
                    cell.className = "fail";
                } else {
                    cell.className = "no-marks";
                }
            }
        });
    });
}

