
const test = require("node:test");
const assert = require("node:assert/strict");
const StudentManager = require("./studentManager");

// Test 1: Calculate the average correctly.
test("calculates a student's average", () => {
    assert.equal(StudentManager.calculateAverage(70, 80, 90), 80);
});

// Test 2: No marks should return null.
test("handles a student with no marks", () => {
    assert.equal(StudentManager.calculateAverage(), null);
});

// Test 3: A student with an average of 50 passes.
test("determines PASS and FAIL correctly", () => {
    assert.equal(StudentManager.determineStatus(50), "PASS");
    assert.equal(StudentManager.determineStatus(49), "FAIL");
});

// Test 4: The default course is applied.
test("uses the default course", () => {
    const student = StudentManager.registerStudent(
        "Test Student",
        undefined,
        70
    );

    assert.equal(student.course, "JavaScript Development");
});

// Test 5: Multiple marks are stored.
test("stores multiple marks and calculates their average", () => {
    const student = StudentManager.registerStudent(
        "Multiple Marks",
        "Web Development",
        60,
        80,
        100
    );

    assert.deepEqual(student.marks, [60, 80, 100]);
    assert.equal(student.average, 80);
});

// Test 6: IDs are unique.
test("generates unique student IDs", () => {
    const first = StudentManager.registerStudent("First Student");
    const second = StudentManager.registerStudent("Second Student");

    assert.notEqual(first.id, second.id);
});

// Test 7: Invalid names are rejected.
test("rejects an empty student name", () => {
    assert.throws(
        () => StudentManager.registerStudent(""),
        /Student name is required/
    );
});

// Test 8: Invalid marks are rejected.
test("rejects marks outside the valid range", () => {
    assert.throws(
        () => StudentManager.registerStudent("Invalid Marks", undefined, 120),
        /Marks must be numbers/
    );
});

// Test 9: Non-numeric marks are rejected.
test("rejects text used as a mark", () => {
    assert.throws(
        () => StudentManager.registerStudent("Text Marks", undefined, "abc"),
        /Marks must be numbers/
    );
});

// Test 10: A student without marks gets NO MARKS.
test("handles a student with no marks", () => {
    const student = StudentManager.registerStudent("No Marks Student");

    assert.equal(student.average, null);
    assert.equal(student.status, "NO MARKS");
});

// Test 11: The callback runs after processing.
test("processes students and runs the callback", async () => {
    let callbackRan = false;

    await StudentManager.processStudents(() => {
        callbackRan = true;
    });

    assert.equal(callbackRan, true);
    assert.ok(StudentManager.getProcessedCount() > 0);
});

// Test 12: The report includes class statistics.
test("generates a report with student statistics", () => {
    const report = StudentManager.generateReport();

    assert.ok(report.totalStudents >= 1);
    assert.equal(
        report.processedStudents,
        StudentManager.getProcessedCount()
    );
});
