let resultCompleted = false;
let operatorUsed = false;
let dotUsed = false;

document.addEventListener("click", function (a) {
    if (a.target.classList.contains("number") || a.target.classList.contains("zero")) {
        if (resultCompleted === true) {
            document.getElementById("expression").innerText =
                document.getElementById("result").innerText;
            if (!a.target.classList.contains("operator_defaults")) {
                document.getElementById("expression").innerText = "";
            }
            document.getElementById("result").innerText = "";
        }
        document.getElementById("expression").innerText += a.target.dataset.value;
        resultCompleted = false;
        operatorUsed = false;
    }
    if (a.target.classList.contains("delete")) {
        let text = document.getElementById("expression").innerText;
        let substring = text.replace(/.$/, "");
        document.getElementById("expression").innerText = substring;
    }
    if (a.target.classList.contains("operator")) {
        if (document.getElementById("expression").innerText === "-") {
            return false;
        }
        if (
            document.getElementById("expression").innerText === "" &&
            a.target.dataset.value != "-" &&
            document.getElementById("result").innerText === ""
        ) {
            return false;
        }
        if (operatorUsed === false) {
            document.getElementById("expression").innerText += a.target.dataset.value;
            operatorUsed = true;
        }
        if (operatorUsed === true) {
            let currentText = document.getElementById("expression").innerText;
            let substring = currentText.replace(/.$/, a.target.dataset.value);
            document.getElementById("expression").innerText = substring;
        }
        if (resultCompleted === true) {
            document.getElementById("expression").innerText =
                document.getElementById("result").innerText;
            document.getElementById("result").innerText = "";
            document.getElementById("expression").innerText += a.target.dataset.value;
            resultCompleted = false;
        }
        dotUsed = false;
    }
    if (a.target.classList.contains("dot")) {
        if (resultCompleted === true) {
            document.getElementById("expression").innerText =
                document.getElementById("result").innerText;
            document.getElementById("result").innerText = "";
            resultCompleted = false;
        }
        if (document.getElementById("expression").innerText === "") {
            dotUsed = true;
            return (document.getElementById("expression").innerText = "0.");
        }
        if (dotUsed === false) {
            document.getElementById("expression").innerText += a.target.dataset.value;
            dotUsed = true;
        }
    }
    if (a.target.classList.contains("clear")) {
        document.getElementById("expression").innerText = "";
        document.getElementById("result").innerText = "";
        dotUsed = false;
        operatorUsed = false;
    }
    if (a.target.classList.contains("equals")) {
        if (
            document.getElementById("expression").innerText === "" &&
            document.getElementById("result").innerText === ""
        ) {
            return (document.getElementById("result").innerText = "0");
        }
        if (document.getElementById("result").innerText === "0") {
            return (document.getElementById("result").innerText = "0");
        }
        let result = eval(document.getElementById("expression").innerText);
        document.getElementById("result").innerText = result;
        if (document.getElementById("result").innerText === "Infinity") {
            document.getElementById("result").innerText = "Error";
        }
        document.getElementById("expression").innerText;
        resultCompleted = true;
    }
    if (a.target.classList.contains("sqrt")) {
        if (
            parseInt(eval(document.getElementById("expression").innerText)) <
            parseInt(0)
        ) {
            return (document.getElementById("result").innerText = "Error");
        }
        if (
            document.getElementById("expression").innerText === "" &&
            document.getElementById("result").innerText === ""
        ) {
            return (document.getElementById("result").innerText = "0");
        }
        if (document.getElementById("result").innerText === "") {
            result = Math.sqrt(
                eval(document.getElementById("expression").innerText)
            );
        } else {
            result = Math.sqrt(document.getElementById("result").innerText);
        }
        document.getElementById("result").innerText = result;
        resultCompleted = true;
    }
});


document.addEventListener("click", function (e) {
    if(e.target.id === "gh_link") {
        window.location.assign("https://github.com/Jacobinoo");
    }
})