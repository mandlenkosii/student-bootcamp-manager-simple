
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


// 10. Update the class statistics.
function updateSummary() {
    document.getElementById("totalStudents").textContent =
        students.length;

    document.getElementById("processedStudents").textContent =
        processingCounter.getCount();

    document.getElementById("passedStudents").textContent =
        students.filter(student =>
            student.processed && student.status === "PASS"
        ).length;

    document.getElementById("failedStudents").textContent =
        students.filter(student =>
            student.processed && student.status === "FAIL"
        ).length;
}


// 11. Process students asynchronously with setTimeout().
function processStudents(callback) {
    const pendingStudents = students.filter(
        student => !student.processed
    );

    let index = 0;

    document.getElementById("processButton").disabled = true;

    function processNextStudent() {
        if (index >= pendingStudents.length) {
            document.getElementById("processingMessage").textContent =
                "Student processing completed.";

            document.getElementById("processButton").disabled = false;

            // Execute the final callback.
            callback();
            return;
        }

        const student = pendingStudents[index];

        document.getElementById("processingMessage").textContent =
            `Processing ${student.name}...`;

        // JavaScript continues running while this timer waits.
        setTimeout(function () {
            student.processed = true;
            processingCounter.increment();

            // Pass a function as an argument.
            runWithCallback(student, function (currentStudent) {
                console.log(`Processed: ${currentStudent.name}`);
            });

            index++;

            updateSummary();
            processNextStudent();
        }, 500);
    }

    processNextStudent();
}


// 12. Create the final report.
const reportManager = {
    title: "STUDENT BOOTCAMP REPORT",

    generate: function () {
        let report = `${this.title}\n`;
        report += `${config.bootcampName}\n`;
        report += `Passing mark: ${config.passingMark}\n`;
        report += "====================================\n";

        students.forEach(student => {
            // apply() passes the marks as an array of arguments.
            const average = calculateAverage.apply(null, student.marks);

            report += `ID: ${student.id}\n`;
            report += `Name: ${student.name}\n`;
            report += `Course: ${student.course}\n`;
            report += `Marks: ${student.marks.length ? student.marks.join(", ") : "No marks"}\n`;
            report += `Average: ${average === null ? "N/A" : average}\n`;
            report += `Status: ${student.status}\n`;
            report += `Processed: ${student.processed ? "Yes" : "No"}\n`;
            report += "------------------------------------\n";
        });

        report += `Total students: ${students.length}\n`;
        report += `Students processed: ${processingCounter.getCount()}\n`;
        report += `Students passed: ${students.filter(s => s.processed && s.status === "PASS").length}\n`;
        report += `Students failed: ${students.filter(s => s.processed && s.status === "FAIL").length}\n`;
        report += `Students without marks: ${students.filter(s => s.status === "NO MARKS").length}\n`;

        return report;
    }
};


// bind() creates a function with a fixed this value.
const generateFinalReport = reportManager.generate.bind(reportManager);


// 13. Connect the registration form to JavaScript.
document.getElementById("studentForm").addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const name = document.getElementById("studentName").value;
        const courseInput = document.getElementById("course").value.trim();
        const marksInput = document.getElementById("marks").value.trim();

        // An empty course becomes undefined, activating the default.
        const course = courseInput === "" ? undefined : courseInput;

        let marks = [];

        if (marksInput !== "") {
            const parts = marksInput.split(",");

            // Reject empty entries, such as "70,,80".
            if (parts.some(part => part.trim() === "")) {
                document.getElementById("message").textContent =
                    "Please enter marks separated by commas.";
                return;
            }

            marks = parts.map(part => Number(part.trim()));
        }

        // The spread operator passes each mark as an argument.
        const result = registerStudent(name, course, ...marks);

        document.getElementById("message").textContent = result;

        if (result.includes("registered successfully")) {
            displayStudents();
            updateSummary();
            document.getElementById("studentForm").reset();
        }
    }
);


// 14. Connect the processing button.
document.getElementById("processButton").addEventListener(
    "click",
    function () {
        if (students.length === 0) {
            document.getElementById("processingMessage").textContent =
                "Register students before processing.";
            return;
        }

        document.getElementById("processingMessage").textContent =
            "Processing has started...";

        console.log("Processing started.");

        // bind() can also preserve this in a future callback.
        processStudents(function () {
            console.log("All students have been processed.");
            updateSummary();
            displayStudents();
        });

        console.log("JavaScript can continue while students are processing.");
    }
);


// 15. Connect the final report button.
document.getElementById("reportButton").addEventListener(
    "click",
    function () {
        document.getElementById("finalReport").textContent =
            generateFinalReport();
    }
);


// 16. Register five sample students.
registerStudent("Thando Mokoena", "JavaScript Development", 75, 80, 65);
registerStudent("Lerato Nkosi", "Web Development", 45, 40, 48);
registerStudent("Sipho Dlamini", "JavaScript Development", 90, 85, 95);
registerStudent("Amahle Khumalo", undefined, 55, 60);
registerStudent("Neo Molefe", "Software Development", 30, 45, 35, 40);


// 17. Demonstrate bind() with a student method.
const studentDescription = studentTools.describe.bind({
    name: "Demo Student",
    course: config.defaultCourse
});

console.log(studentDescription());


// Show the initial student list.
displayStudents();
updateSummary();

console.log("Student Bootcamp Manager is ready.");