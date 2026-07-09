(function () {
    "use strict";

    const form = document.getElementById("intro-form");
    const resultContainer = document.getElementById("intro-result");
    const clearButton = document.getElementById("clear-form");
    const addCourseButton = document.getElementById("add-course");
    const coursesContainer = document.getElementById("courses-container");
    const mainContainer = document.getElementById("intro-form-main");
    const generateHtmlButton = document.getElementById("generate-html");
    const generateJsonButton = document.getElementById("generate-json");
    const generateXmlButton = document.getElementById("generate-xml");
    const codeOutput = document.getElementById("code-output");
    const codeOutputTitle = document.getElementById("code-output-title");
    const codeOutputText = document.getElementById("code-output-text");

    if (!form || !resultContainer || !clearButton || !addCourseButton || !coursesContainer || !mainContainer || !generateHtmlButton || !generateJsonButton || !generateXmlButton || !codeOutput || !codeOutputTitle || !codeOutputText) {
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

    function escapeXml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&apos;");
    }

    function buildCourseRow(course) {
        return (
            "<li><strong>" + escapeHtml(course.department) + " " + escapeHtml(course.number) +
            " - " + escapeHtml(course.name) + "</strong>: " + escapeHtml(course.reason) + "</li>"
        );
    }

    function getValue(name) {
        const element = form.elements[name];
        return element ? String(element.value).trim() : "";
    }

    function buildLinkData() {
        return [1, 2, 3, 4, 5, 6].map((index) => ({
            label: getValue("link" + index + "Label"),
            url: getValue("link" + index + "Url")
        })).filter((link) => link.label && link.url);
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
            name: "Front-End Web App Development",
            reason: "Required as part of my core classes."
        }));
        coursesContainer.appendChild(createCourseInputs({
            department: "ITSC",
            number: "3155",
            name: "Software Engineering",
            reason: "Required for my major and degree progression."
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

    function buildLinksHtml() {
        const links = buildLinkData();

        return links
            .map((link) => "<a href=\"" + escapeHtml(link.url) + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + escapeHtml(link.label) + "</a>")
            .join(" | ");
    }

    function hideGeneratedOutput() {
        codeOutput.hidden = true;
        codeOutputTitle.textContent = "Generated Output";
        codeOutputText.value = "";
    }

    function showGeneratedOutput(title, content) {
        codeOutputTitle.textContent = title;
        codeOutputText.value = content;
        codeOutput.hidden = false;
    }

    function buildIntroductionData(pictureSrc) {
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
            return null;
        }

        return {
            fullName: fullNameParts.join(" "),
            acknowledgment: getValue("acknowledgment"),
            ackDate: getValue("ackDate"),
            mascotAdjective: getValue("mascotAdjective"),
            mascotAnimal: getValue("mascotAnimal"),
            divider: getValue("divider"),
            pictureSrc: pictureSrc || getValue("pictureDefault"),
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
            share: getValue("share"),
            links: buildLinkData()
        };
    }

    async function collectIntroductionData() {
        if (!form.reportValidity()) {
            return null;
        }

        const fileInput = document.getElementById("picture-upload");
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            try {
                uploadedImageData = await readUploadedImage(fileInput.files[0]);
            } catch (error) {
                window.alert("Could not load the selected image. Please choose another file.");
                return null;
            }
        }

        return buildIntroductionData(uploadedImageData || getValue("pictureDefault"));
    }

    function buildHtmlSource(data) {
        const courseMarkup = data.courses.map((course) => (
            "            <li><strong>" + escapeHtml(course.department) + " " + escapeHtml(course.number) + " - " + escapeHtml(course.name) + "</strong>: " + escapeHtml(course.reason) + "</li>"
        )).join("\n");
        const linkMarkup = data.links.map((link) => (
            "<a href=\"" + escapeHtml(link.url) + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + escapeHtml(link.label) + "</a>"
        )).join(" | ");
        const optionalFunnyThing = data.funnyThing ? "        <li><strong>Funny Thing:</strong> " + escapeHtml(data.funnyThing) + "</li>\n" : "";
        const optionalShare = data.share ? "        <li><strong>Something I would like to share:</strong> " + escapeHtml(data.share) + "</li>\n" : "";

        return [
            "<section class=\"generated-introduction\">",
            "    <h2>Introduction</h2>",
            "    <h3>" + escapeHtml(data.fullName) + " | " + escapeHtml(data.mascotAdjective + " " + data.mascotAnimal) + "</h3>",
            "    <figure>",
            "        <img src=\"" + escapeHtml(data.pictureSrc) + "\" alt=\"" + escapeHtml(data.pictureCaption) + "\">",
            "        <figcaption><strong>" + escapeHtml(data.pictureCaption) + "</strong></figcaption>",
            "    </figure>",
            "    <ul>",
            "        <li><strong>Name:</strong> " + escapeHtml(data.fullName) + "</li>",
            "        <li><strong>Motto:</strong> " + escapeHtml(data.mascotAdjective + " " + data.mascotAnimal) + "</li>",
            "        <li><strong>Divider:</strong> " + escapeHtml(data.divider) + "</li>",
            "        <li><strong>Acknowledgment:</strong> " + escapeHtml(data.acknowledgment) + " (" + escapeHtml(data.ackDate) + ")</li>",
            "        <li><strong>Personal Statement:</strong> " + escapeHtml(data.personalStatement) + "</li>",
            "        <li><strong>Personal Background:</strong> " + escapeHtml(data.personalBackground) + "</li>",
            "        <li><strong>Professional Background:</strong> " + escapeHtml(data.professionalBackground) + "</li>",
            "        <li><strong>Academic Background:</strong> " + escapeHtml(data.academicBackground) + "</li>",
            "        <li><strong>Background with Web Development:</strong> " + escapeHtml(data.webdevBackground) + "</li>",
            "        <li><strong>Primary Computer Platform:</strong> " + escapeHtml(data.primaryPlatform) + "</li>",
            "        <li><strong>Courses I'm Taking This Semester:</strong>",
            "            <ul>",
            courseMarkup,
            "            </ul>",
            "        </li>",
            "        <li><strong>Quote:</strong> \"" + escapeHtml(data.quote) + "\" - " + escapeHtml(data.quoteAuthor) + "</li>",
            optionalFunnyThing + optionalShare + "        <li><strong>Interesting Fact:</strong> " + escapeHtml(data.interestingFact) + "</li>",
            "    </ul>",
            "    <p><strong>Useful Links:</strong> " + linkMarkup + "</p>",
            "</section>"
        ].join("\n");
    }

    function buildJsonSource(data) {
        return JSON.stringify(data, null, 2);
    }

    function buildXmlSource(data) {
        const courseEntries = data.courses.map((course) => [
            "    <course>",
            "      <department>" + escapeXml(course.department) + "</department>",
            "      <number>" + escapeXml(course.number) + "</number>",
            "      <name>" + escapeXml(course.name) + "</name>",
            "      <reason>" + escapeXml(course.reason) + "</reason>",
            "    </course>"
        ].join("\n")).join("\n");

        const linkEntries = data.links.map((link) => [
            "    <link>",
            "      <label>" + escapeXml(link.label) + "</label>",
            "      <url>" + escapeXml(link.url) + "</url>",
            "    </link>"
        ].join("\n")).join("\n");

        return [
            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
            "<introduction>",
            "  <fullName>" + escapeXml(data.fullName) + "</fullName>",
            "  <mascot>",
            "    <adjective>" + escapeXml(data.mascotAdjective) + "</adjective>",
            "    <animal>" + escapeXml(data.mascotAnimal) + "</animal>",
            "  </mascot>",
            "  <divider>" + escapeXml(data.divider) + "</divider>",
            "  <acknowledgment>",
            "    <statement>" + escapeXml(data.acknowledgment) + "</statement>",
            "    <date>" + escapeXml(data.ackDate) + "</date>",
            "  </acknowledgment>",
            "  <picture>",
            "    <src>" + escapeXml(data.pictureSrc) + "</src>",
            "    <caption>" + escapeXml(data.pictureCaption) + "</caption>",
            "  </picture>",
            "  <personalStatement>" + escapeXml(data.personalStatement) + "</personalStatement>",
            "  <personalBackground>" + escapeXml(data.personalBackground) + "</personalBackground>",
            "  <professionalBackground>" + escapeXml(data.professionalBackground) + "</professionalBackground>",
            "  <academicBackground>" + escapeXml(data.academicBackground) + "</academicBackground>",
            "  <webdevBackground>" + escapeXml(data.webdevBackground) + "</webdevBackground>",
            "  <primaryPlatform>" + escapeXml(data.primaryPlatform) + "</primaryPlatform>",
            "  <interestingFact>" + escapeXml(data.interestingFact) + "</interestingFact>",
            "  <courses>",
            courseEntries,
            "  </courses>",
            "  <quote>",
            "    <text>" + escapeXml(data.quote) + "</text>",
            "    <author>" + escapeXml(data.quoteAuthor) + "</author>",
            "  </quote>",
            "  <funnyThing>" + escapeXml(data.funnyThing) + "</funnyThing>",
            "  <share>" + escapeXml(data.share) + "</share>",
            "  <links>",
            linkEntries,
            "  </links>",
            "</introduction>"
        ].join("\n");
    }

    async function generateCodeOutput(type) {
        const data = await collectIntroductionData();
        if (!data) {
            return;
        }

        if (type === "html") {
            showGeneratedOutput("Generated HTML", buildHtmlSource(data));
            return;
        }

        if (type === "json") {
            showGeneratedOutput("Generated JSON", buildJsonSource(data));
            return;
        }

        showGeneratedOutput("Generated XML", buildXmlSource(data));
    }

    function renderIntroduction(data) {
        const coursesHtml = data.courses.map(buildCourseRow).join("");
        const linksHtml = buildLinksHtml();

        resultContainer.innerHTML = "" +
            "<h2>Introduction</h2>" +
            "<h3 class=\"intro-heading\">" + escapeHtml(data.fullName) + " | " + escapeHtml(data.mascotAdjective + " " + data.mascotAnimal) + "</h3>" +
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

        const data = await collectIntroductionData();
        if (!data) {
            return;
        }

        renderIntroduction(data);
    });

    form.addEventListener("reset", function () {
        window.setTimeout(function () {
            uploadedImageData = "";
            resetCourseRows();
            form.hidden = false;
            resultContainer.hidden = true;
            resultContainer.innerHTML = "";
            hideGeneratedOutput();
        }, 0);
    });

    clearButton.addEventListener("click", function () {
        clearFields();
        hideGeneratedOutput();
    });

    generateHtmlButton.addEventListener("click", function () {
        generateCodeOutput("html");
    });

    generateJsonButton.addEventListener("click", function () {
        generateCodeOutput("json");
    });

    generateXmlButton.addEventListener("click", function () {
        generateCodeOutput("xml");
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
            hideGeneratedOutput();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });
})();
