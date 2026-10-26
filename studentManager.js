
/*
Student Bootcamp Manager
Core student functions and Module 4 concepts.
*/

// IIFE: keep the configuration in a protected scope.
const StudentManager = (() => {
    const config = {
        bootcampName: "Melsoft Academy",
        passingMark: 50,
        defaultCourse: "JavaScript Development"
    };

    const students = [];
    const idGenerator = generateStudentIds();
    const counter = createProcessingCounter();

    // Generator: produce unique student IDs.
    function* generateStudentIds() {
        let number = 1001;

        while (true) {
            yield `STU-${number++}`;
        }
    }

    // Closure: remember the number of processed students.
    function createProcessingCounter() {
        let count = 0;

        return {
            increment: () => ++count,
            getCount: () => count
        };
    }

    // Rest parameters: accept any number of marks.
    function calculateAverage(...marks) {
        if (marks.length === 0) {
            return null;
        }

        return Number(
            (marks.reduce((total, mark) => total + mark, 0) /
                marks.length).toFixed(2)
        );
    }

    // Default parameter: use the configured passing mark.
    function determineStatus(average, passingMark = config.passingMark) {
        if (average === null) {
            return "NO MARKS";
        }

        return average >= passingMark ? "PASS" : "FAIL";
    }

    // Register a student with validation.
    function registerStudent(
        name,
        course = config.defaultCourse,
        ...marks
    ) {
        if (typeof name !== "string" || !name.trim()) {
            throw new Error("Student name is required.");
        }

        if (typeof course !== "string" || !course.trim()) {
            throw new Error("A valid course is required.");
        }

        const invalidMarks = marks.some(mark =>
            typeof mark !== "number" ||
            !Number.isFinite(mark) ||
            mark < 0 ||
            mark > 100
        );

        if (invalidMarks) {
            throw new Error("Marks must be numbers from 0 to 100.");
        }

        const average = calculateAverage(...marks);

        const student = {
            id: idGenerator.next().value,
            name: name.trim(),
            course: course.trim(),
            marks: [...marks],
            average,
            status: determineStatus(average),
            processed: false
        };

        students.push(student);

        return student;
    }

    // this: describe the object calling this method.
    const studentTools = {
        describe: function () {
            return `${this.name} - ${this.course}`;
        }
    };

    // Higher-order function: receive and execute a callback.
    function runWithCallback(student, callback) {
        if (typeof callback !== "function") {
            throw new Error("A callback function is required.");
        }

        callback(student);
    }

    // Process students asynchronously.
    function processStudents(callback = () => {}) {
        if (typeof callback !== "function") {
            throw new Error("A callback function is required.");
        }

        return new Promise(resolve => {
            const pending = students.filter(s => !s.processed);
            let index = 0;

            function processNext() {
                if (index >= pending.length) {
                    callback();
                    resolve();
                    return;
                }

                const student = pending[index];

                setTimeout(() => {
                    student.processed = true;
                    counter.increment();

                    runWithCallback(student, current => {
                        index++;
                        processNext();
                    });
                }, 10);
            }

            processNext();
        });
    }

    // Generate the final student and class report.
    function generateReport() {
        const reportStudents = students.map(student => ({
            ...student,
            marks: [...student.marks]
        }));

        return {
            bootcampName: config.bootcampName,
            passingMark: config.passingMark,
            students: reportStudents,
            totalStudents: students.length,
            processedStudents: counter.getCount(),
            passedStudents: students.filter(
                s => s.processed && s.status === "PASS"
            ).length,
            failedStudents: students.filter(
                s => s.processed && s.status === "FAIL"
            ).length,
            studentsWithoutMarks: students.filter(
                s => s.status === "NO MARKS"
            ).length
        };
    }

    // Functions as values: expose reusable functions.
    return {
        config: { ...config },
        students,
        calculateAverage,
        determineStatus,
        registerStudent,
        studentTools,
        runWithCallback,
        processStudents,
        generateReport,
        getProcessedCount: counter.getCount
    };
})();

// Make the same functions available to Node.js tests and the browser.
if (typeof module !== "undefined" && module.exports) {
    module.exports = StudentManager;
}

if (typeof window !== "undefined") {
    window.StudentManager = StudentManager;
}
