(function () {
    "use strict";

    const form = document.getElementById("intro-form");
    const resultContainer = document.getElementById("intro-result");
    const clearButton = document.getElementById("clear-form");
    const addCourseButton = document.getElementById("add-course");
    const coursesContainer = document.getElementById("courses-container");
    const mainContainer = document.getElementById("intro-form-main");

    if (!form || !resultContainer || !clearButton || !addCourseButton || !coursesContainer || !mainContainer) {
        return;
    }

    let uploadedImageData = "";

    function escapeHtml(value) {
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function readUploadedImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function () {
                resolve(typeof reader.result === "string" ? reader.result : "");
            };
            reader.onerror = function () {
                reject(new Error("Unable to read image file."));
            };
            reader.readAsDataURL(file);
        });
    }

    function buildCourseRow(course) {
        return (
            "<li><strong>" + escapeHtml(course.department) + " " + escapeHtml(course.number) +
            " - " + escapeHtml(course.name) + "</strong>: " + escapeHtml(course.reason) + "</li>"
        );
    }

    function getCourseData() {
        const rows = Array.from(document.querySelectorAll(".course-row"));
        const courses = [];

        rows.forEach((row) => {
            const inputs = row.querySelectorAll("input");
            if (inputs.length !== 4) {
                return;
            }

            courses.push({
                department: inputs[0].value.trim(),
                number: inputs[1].value.trim(),
                name: inputs[2].value.trim(),
                reason: inputs[3].value.trim()
            });
        });

        return courses;
    }

    function createCourseInputs(values) {
        const row = document.createElement("div");
        row.className = "course-row";

        row.innerHTML = "" +
            "<input type=\"text\" name=\"courseDepartment[]\" placeholder=\"Department\" required>" +
            "<input type=\"text\" name=\"courseNumber[]\" placeholder=\"Number\" required>" +
            "<input type=\"text\" name=\"courseName[]\" placeholder=\"Course name\" required>" +
            "<input type=\"text\" name=\"courseReason[]\" placeholder=\"Reason\" required>" +
            "<button type=\"button\" class=\"remove-course\" aria-label=\"Remove this course\">Remove</button>";

        const inputs = row.querySelectorAll("input");
        if (values) {
            inputs[0].value = values.department || "";
            inputs[1].value = values.number || "";
            inputs[2].value = values.name || "";
            inputs[3].value = values.reason || "";
        }

        return row;
    }

    function resetCourseRows() {
        coursesContainer.innerHTML = "";
        coursesContainer.appendChild(createCourseInputs({
            department: "ITIS",
            number: "3135",
            name: "Web App Design and Development",
            reason: "Build practical front-end skills"
        }));
        coursesContainer.appendChild(createCourseInputs({
            department: "ITSC",
            number: "3155",
            name: "Software Engineering",
            reason: "Learn team-based software development"
        }));
    }

    function clearCourseRows() {
        coursesContainer.innerHTML = "";
        coursesContainer.appendChild(createCourseInputs());
    }

    function clearFields() {
        Array.from(form.elements).forEach((element) => {
            const tagName = element.tagName.toLowerCase();

            if (element.type === "button" || element.type === "submit" || element.type === "reset") {
                return;
            }

            if (element.type === "checkbox" || element.type === "radio") {
                element.checked = false;
                return;
            }

            if (tagName === "input" || tagName === "textarea" || tagName === "select") {
                element.value = "";
            }
        });

        uploadedImageData = "";
        clearCourseRows();
    }

    function getValue(name) {
        const element = form.elements[name];
        return element ? String(element.value).trim() : "";
    }

    function buildLinksHtml() {
        const links = [1, 2, 3, 4, 5].map((index) => ({
            label: getValue("link" + index + "Label"),
            url: getValue("link" + index + "Url")
        }));

        return links
            .filter((link) => link.label && link.url)
            .map((link) => "<a href=\"" + escapeHtml(link.url) + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + escapeHtml(link.label) + "</a>")
            .join(" | ");
    }

    function renderIntroduction(data) {
        const coursesHtml = data.courses.map(buildCourseRow).join("");
        const linksHtml = buildLinksHtml();

        resultContainer.innerHTML = "" +
            "<h2>Introduction Form</h2>" +
            "<figure>" +
            "<div class=\"img-glow-wrapper\">" +
            "<img src=\"" + escapeHtml(data.pictureSrc) + "\" alt=\"" + escapeHtml(data.pictureCaption) + "\" class=\"intro-image\">" +
            "</div>" +
            "<figcaption><strong>" + escapeHtml(data.pictureCaption) + "</strong></figcaption>" +
            "</figure>" +
            "<ul>" +
            "<li><strong>Name:</strong> " + escapeHtml(data.fullName) + "</li>" +
            "<li><strong>Motto:</strong> " + escapeHtml(data.mascotAdjective + " " + data.mascotAnimal) + "</li>" +
            "<li><strong>Divider:</strong> " + escapeHtml(data.divider) + "</li>" +
            "<li><strong>Acknowledgment:</strong> " + escapeHtml(data.acknowledgment) + " (" + escapeHtml(data.ackDate) + ")</li>" +
            "<li><strong>Personal Statement:</strong> " + escapeHtml(data.personalStatement) + "</li>" +
            "<li><strong>Personal Background:</strong> " + escapeHtml(data.personalBackground) + "</li>" +
            "<li><strong>Professional Background:</strong> " + escapeHtml(data.professionalBackground) + "</li>" +
            "<li><strong>Academic Background:</strong> " + escapeHtml(data.academicBackground) + "</li>" +
            "<li><strong>Background with Web Development:</strong> " + escapeHtml(data.webdevBackground) + "</li>" +
            "<li><strong>Primary Computer Platform:</strong> " + escapeHtml(data.primaryPlatform) + "</li>" +
            "<li><strong>Courses I'm Taking This Semester:</strong><ul>" + coursesHtml + "</ul></li>" +
            "<li><strong>Quote:</strong> \"" + escapeHtml(data.quote) + "\" - " + escapeHtml(data.quoteAuthor) + "</li>" +
            (data.funnyThing ? "<li><strong>Funny Thing:</strong> " + escapeHtml(data.funnyThing) + "</li>" : "") +
            (data.share ? "<li><strong>Something I would like to share:</strong> " + escapeHtml(data.share) + "</li>" : "") +
            "<li><strong>Interesting Fact:</strong> " + escapeHtml(data.interestingFact) + "</li>" +
            "</ul>" +
            "<p><strong>Useful Links:</strong> " + linksHtml + "</p>" +
            "<p class=\"signature\"><a href=\"#\" id=\"reset-link\">Reset Introduction Form</a></p>";

        form.hidden = true;
        resultContainer.hidden = false;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        const fullNameParts = [
            getValue("firstName"),
            getValue("middleName"),
            getValue("preferredName") ? "(\"" + getValue("preferredName") + "\")" : "",
            getValue("lastName")
        ].filter(Boolean);

        const courses = getCourseData();
        const hasInvalidCourse = courses.some((course) => !course.department || !course.number || !course.name || !course.reason);

        if (courses.length === 0 || hasInvalidCourse) {
            window.alert("Please provide complete values for every course row.");
            return;
        }

        const fileInput = document.getElementById("picture-upload");
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            try {
                uploadedImageData = await readUploadedImage(fileInput.files[0]);
            } catch (error) {
                window.alert("Could not load the selected image. Please choose another file.");
                return;
            }
        }

        const defaultImage = getValue("pictureDefault");

        renderIntroduction({
            fullName: fullNameParts.join(" "),
            acknowledgment: getValue("acknowledgment"),
            ackDate: getValue("ackDate"),
            mascotAdjective: getValue("mascotAdjective"),
            mascotAnimal: getValue("mascotAnimal"),
            divider: getValue("divider"),
            pictureSrc: uploadedImageData || defaultImage,
            pictureCaption: getValue("pictureCaption"),
            personalStatement: getValue("personalStatement"),
            personalBackground: getValue("personalBackground"),
            professionalBackground: getValue("professionalBackground"),
            academicBackground: getValue("academicBackground"),
            webdevBackground: getValue("webdevBackground"),
            primaryPlatform: getValue("primaryPlatform"),
            interestingFact: getValue("interestingFact"),
            courses: courses,
            quote: getValue("quote"),
            quoteAuthor: getValue("quoteAuthor"),
            funnyThing: getValue("funnyThing"),
            share: getValue("share")
        });
    });

    form.addEventListener("reset", function () {
        window.setTimeout(function () {
            uploadedImageData = "";
            resetCourseRows();
            form.hidden = false;
            resultContainer.hidden = true;
            resultContainer.innerHTML = "";
        }, 0);
    });

    clearButton.addEventListener("click", function () {
        clearFields();
    });

    addCourseButton.addEventListener("click", function () {
        coursesContainer.appendChild(createCourseInputs());
    });

    coursesContainer.addEventListener("click", function (event) {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        if (target.classList.contains("remove-course")) {
            const rows = coursesContainer.querySelectorAll(".course-row");
            if (rows.length === 1) {
                window.alert("At least one course is required.");
                return;
            }

            const row = target.closest(".course-row");
            if (row) {
                row.remove();
            }
        }
    });

    mainContainer.addEventListener("click", function (event) {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        if (target.id === "reset-link") {
            event.preventDefault();
            form.reset();
            uploadedImageData = "";
            form.hidden = false;
            resultContainer.hidden = true;
            resultContainer.innerHTML = "";
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });
})();
