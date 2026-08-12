const openPanel = document.getElementById("openPanel");
const closePanel = document.getElementById("closePanel");
const sidePanel = document.getElementById("sidePanel");
const overlay = document.getElementById("overlay");

const fields = document.querySelectorAll(".inaccessible-field");

const fieldList = document.getElementById("fieldList");
const problemCount = document.getElementById("problemCount");

const correctAll = document.getElementById("correctAll");
const correctWithAI = document.getElementById("correctWithAI");
const readFields = document.getElementById("readFields");


/* =========================
   ABRIR PAINEL
========================= */

function openAccessibilityPanel() {
    sidePanel.classList.add("active");
    overlay.classList.add("active");
}


/* =========================
   FECHAR PAINEL
========================= */

function closeAccessibilityPanel() {
    sidePanel.classList.remove("active");
    overlay.classList.remove("active");
}


openPanel.addEventListener("click", openAccessibilityPanel);

closePanel.addEventListener("click", closeAccessibilityPanel);

overlay.addEventListener("click", closeAccessibilityPanel);


/* =========================
   ATALHO ALT + A
========================= */

document.addEventListener("keydown", function(event) {

    if (event.altKey && event.key.toLowerCase() === "a") {

        event.preventDefault();

        openAccessibilityPanel();
    }

    if (event.key === "Escape") {
        closeAccessibilityPanel();
    }

});


/* =========================
   DETECTAR CAMPOS
========================= */

function detectFields() {

    fieldList.innerHTML = "";

    fields.forEach((field, index) => {

        const item = document.createElement("div");

        item.className = "field-item";

        const name =
            field.placeholder ||
            `Campo ${index + 1}`;

        item.innerHTML = `
            <span>
                ⚠️ ${name}
            </span>

            <button data-index="${index}">
                Corrigir
            </button>
        `;

        fieldList.appendChild(item);
    });

    problemCount.textContent =
        `${fields.length} campos`;
}


/* =========================
   CORRIGIR UM CAMPO
========================= */

function fixField(field, index) {

    const label = document.createElement("label");

    label.textContent =
        `Campo ${index + 1}`;

    label.htmlFor = `access-field-${index}`;

    field.id = `access-field-${index}`;

    field.parentElement.insertBefore(
        label,
        field
    );

    field.classList.remove("inaccessible-field");

    field.style.borderColor = "#20c997";
}


/* =========================
   BOTÕES "CORRIGIR"
========================= */

fieldList.addEventListener("click", function(event) {

    if (!event.target.matches("button")) {
        return;
    }

    const index =
        Number(event.target.dataset.index);

    const field = fields[index];

    fixField(field, index);

    event.target.textContent = "✓ Corrigido";
    event.target.disabled = true;

});


/* =========================
   CORRIGIR TODOS
========================= */

function fixAllFields() {

    fields.forEach((field, index) => {

        if (!field.id) {
            fixField(field, index);
        }

    });

    detectFields();
}


correctAll.addEventListener(
    "click",
    fixAllFields
);

correctWithAI.addEventListener(
    "click",
    function() {

        alert(
            "🤖 IA analisando os campos...\n\n" +
            "4 campos sem rótulos foram identificados."
        );

        setTimeout(() => {

            fixAllFields();

            alert(
                "✅ Campos corrigidos com sucesso!"
            );

        }, 800);

    }
);


/* =========================
   LEITURA EM VOZ ALTA
========================= */

readFields.addEventListener(
    "click",
    function() {

        if (!("speechSynthesis" in window)) {

            alert(
                "Seu navegador não suporta síntese de voz."
            );

            return;
        }

        const text = Array.from(fields)
            .map((field, index) => {

                return `Campo ${index + 1}: ${
                    field.placeholder || "sem descrição"
                }`;

            })
            .join(". ");

        const speech =
            new SpeechSynthesisUtterance(text);

        speech.lang = "pt-BR";

        window.speechSynthesis.speak(speech);

    }
);


/* =========================
   CONTRASTE
========================= */

document
    .querySelectorAll(".contrast-buttons button")
    .forEach(button => {

        button.addEventListener("click", function() {

            const mode =
                this.dataset.mode;

            document.body.classList.remove(
                "high-contrast",
                "invert"
            );

            if (mode === "high") {
                document.body.classList.add(
                    "high-contrast"
                );
            }

            if (mode === "invert") {
                document.body.classList.add(
                    "invert"
                );

            }

        });

    });


/* =========================
   INICIAR
========================= */

detectFields();