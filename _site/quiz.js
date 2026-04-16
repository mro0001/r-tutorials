document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".quiz").forEach(function (quiz) {
    var id = quiz.dataset.id;
    var type = quiz.dataset.type || "single";
    var attempts = 0;
    var maxAttempts = 2;

    var items = quiz.querySelectorAll("li");
    var correctIndices = [];

    items.forEach(function (li, i) {
      var cb = li.querySelector('input[type="checkbox"]');
      if (cb && cb.checked) {
        correctIndices.push(i);
        cb.checked = false;
      }

      var label = document.createElement("label");
      label.className = "quiz-opt";
      label.dataset.index = i;

      var input = document.createElement("input");
      input.type = type === "multi" ? "checkbox" : "radio";
      input.name = "quiz-" + id;
      input.value = i;

      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + li.textContent.trim()));

      li.replaceWith(label);
    });

    var ul = quiz.querySelector("ul");
    if (ul) {
      var frag = document.createDocumentFragment();
      while (ul.firstChild) frag.appendChild(ul.firstChild);
      ul.replaceWith(frag);
    }

    var btn = document.createElement("button");
    btn.className = "quiz-check";
    btn.textContent = "Check Answer";
    quiz.appendChild(btn);

    var feedback = document.createElement("div");
    feedback.className = "quiz-feedback";
    quiz.appendChild(feedback);

    function resetStyles() {
      quiz.querySelectorAll("label.quiz-opt").forEach(function (lbl) {
        lbl.classList.remove(
          "correct-selected",
          "incorrect-selected",
          "correct-reveal"
        );
      });
    }

    btn.addEventListener("click", function () {
      var labels = quiz.querySelectorAll("label.quiz-opt");
      var selected = [];

      resetStyles();

      labels.forEach(function (lbl) {
        var inp = lbl.querySelector("input");
        if (inp.checked) selected.push(parseInt(lbl.dataset.index));
      });

      if (selected.length === 0) {
        feedback.textContent = "Please select an answer.";
        feedback.className = "quiz-feedback incorrect";
        return;
      }

      attempts++;

      var isCorrect =
        selected.length === correctIndices.length &&
        selected.every(function (s) {
          return correctIndices.indexOf(s) !== -1;
        });

      labels.forEach(function (lbl) {
        var idx = parseInt(lbl.dataset.index);
        var inp = lbl.querySelector("input");
        if (inp.checked && correctIndices.indexOf(idx) !== -1) {
          lbl.classList.add("correct-selected");
        } else if (inp.checked) {
          lbl.classList.add("incorrect-selected");
        }
        if (!isCorrect && attempts >= maxAttempts && correctIndices.indexOf(idx) !== -1) {
          lbl.classList.add("correct-reveal");
        }
      });

      if (isCorrect) {
        feedback.textContent = "Correct!";
        feedback.className = "quiz-feedback correct";
        btn.disabled = true;
      } else if (attempts < maxAttempts) {
        feedback.textContent = "Not quite — try once more.";
        feedback.className = "quiz-feedback incorrect";
        btn.textContent = "Try Again";
        labels.forEach(function (lbl) {
          lbl.querySelector("input").checked = false;
        });
        setTimeout(function () {
          resetStyles();
          feedback.textContent = "";
        }, 2000);
      } else {
        feedback.textContent =
          "The correct answer is highlighted above.";
        feedback.className = "quiz-feedback incorrect";
        btn.disabled = true;
      }
    });
  });
});
