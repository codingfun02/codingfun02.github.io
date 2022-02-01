import manageTrainings from "./manageTrainings.mjs";
import manageSetTrainingDays from "./manageSetTrainingDays.mjs";

const addTrainingForm = document.querySelector(".js-addTrainingForm"),
    trainingNameInput = addTrainingForm.querySelector(".js-trainingNameInput"),
    trainingDateInput = addTrainingForm.querySelector(".js-trainingDateInput"),
    trainingList = document.querySelector(".js-trainingList"),
    trainingDayList = document.querySelector(".js-trainingDayList");

const TRAINING_NAME_SPAN_CLASS_NAME = "trainingNameSpan",
    TRAINING_DAY_DDAY_CLASS_NAME = "trainingDayDDay",
    TRAINING_NAME_SPAN_SELECTED_CLASS_NAME = "trainingNameSpanSelected",
    HIDDEN_CLASS_NAME = "hidden";

function repaint() {
    trainingList.innerHTML = "";
    manageTrainings.trainings.forEach((training, index) => {
        paintTraining(training, index);
    });
}

function getDDayString(dDay) {
    const dDayTime = dDay.getTime();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    let result;
    if (dDayTime > todayTime) {
        const gap = dDay.getTime() - today.getTime();
        const remainingDays = gap / (1000 * 60 * 60 * 24);
        result = `D-${remainingDays}`;
    } else if (dDayTime < todayTime) {
        const gap = today.getTime() - dDay.getTime();
        const remainingDays = gap / (1000 * 60 * 60 * 24);
        result = `D+${remainingDays}`;
    } else {
        result = "D-DAY";
    }
    return result;
}

function parseDate(date) {
    const dateArray = date.split(".");
    const currentYear = new Date().getFullYear();
    return new Date(currentYear, dateArray[0] - 1, dateArray[1]);
}

function trainingToDoChecked(event) {
    const target = event.target;
    const li = target.parentElement;
    const trainingNumber = li.dataset.trainingId;
    const dayNumber = li.dataset.dayId;
    const toDoNumber = li.dataset.toDoId;
    manageTrainings.editTraining(trainingNumber, dayNumber, toDoNumber, target.checked);
}

function paintTrainingDay(trainingDay, trainingDDayString, trainingNumber, trainingDayNumber) {
    const li1 = document.createElement("li");
    const details = document.createElement("details");
    details.open = true;
    const summary = document.createElement("summary");
    const trainingDayText = trainingDay.text;
    summary.innerText = trainingDayText;
    if (trainingDayText === trainingDDayString) {
        summary.classList.add(TRAINING_DAY_DDAY_CLASS_NAME);
    }
    const ul = document.createElement("ul");
    ul.classList.add("main__training-to-do-list");
    const trainingDayToDos = trainingDay.toDos;
    trainingDayToDos.forEach((toDo, toDoIndex) => {
        const li2 = document.createElement("li");
        li2.dataset.trainingId = trainingNumber;
        li2.dataset.dayId = trainingDayNumber;
        li2.dataset.toDoId = toDoIndex;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = toDo.isDone;
        checkbox.addEventListener("click", trainingToDoChecked);
        const span = document.createElement("span");
        span.innerText = toDo.text;
        li2.appendChild(checkbox);
        li2.appendChild(span);
        ul.appendChild(li2);
    });
    details.appendChild(summary);
    details.appendChild(ul);
    li1.appendChild(details);
    trainingDayList.appendChild(li1);
    
}

function handleTrainingSpanClick(event) {
    const target = event.target;
    const div = target.parentElement;
    const li = div.parentElement;
    trainingDayList.classList.remove(HIDDEN_CLASS_NAME);
    li.appendChild(trainingDayList);
    const trainingId = Number(li.dataset.trainingId);
    const trainingDDayString = li.dataset.dDayString;
    const spans = trainingList.getElementsByClassName(TRAINING_NAME_SPAN_CLASS_NAME);
    Array.from(spans).forEach((span) => {
        span.classList.remove(TRAINING_NAME_SPAN_SELECTED_CLASS_NAME);
    });
    target.classList.add(TRAINING_NAME_SPAN_SELECTED_CLASS_NAME);
    trainingDayList.innerHTML = "";
    const trainingDays = manageTrainings.trainings[trainingId].days;
    trainingDays.forEach((trainingDay, trainingDayIndex) => paintTrainingDay(trainingDay, trainingDDayString, trainingId, trainingDayIndex));
    trainingList.scroll(0, 0);
}

function handleTrainingDelBtnClick(event) {
    const currentTarget = event.currentTarget;
    const li = currentTarget.parentElement;
    const span = li.querySelector("span");
    const trainingId = li.dataset.trainingId;
    manageTrainings.deleteTraining(trainingId);
    if (span.classList.contains(TRAINING_NAME_SPAN_SELECTED_CLASS_NAME)) {
        trainingDayList.innerHTML = "";
    }
    li.remove();
    repaint();
}

function paintTraining(training, index) {
    const trainingName = training.name;
    const trainingDate = new Date(training.date);
    const trainingMonth = trainingDate.getMonth() + 1;
    const trainingDay = trainingDate.getDate();
    const dDayString = getDDayString(trainingDate);
    const li = document.createElement("li");
    li.dataset.trainingId = index;
    li.dataset.dDayString = dDayString;
    const div = document.createElement("div");
    const span = document.createElement("span");
    span.classList.add(TRAINING_NAME_SPAN_CLASS_NAME);
    span.innerText = `${trainingName}(${trainingMonth}.${trainingDay}) ${dDayString}`;
    span.addEventListener("click", handleTrainingSpanClick);
    const delBtn = document.createElement("button");
    delBtn.innerHTML = "<i class='fas fa-trash-alt'></i>";
    delBtn.addEventListener("click", handleTrainingDelBtnClick);
    div.appendChild(span);
    div.appendChild(delBtn);
    li.appendChild(div);
    trainingList.appendChild(li);
}

function handleAddTrainingFormSubmit(event) {
    event.preventDefault();
    const trainingNameInputValue = trainingNameInput.value;
    const trainingDateInputValue = trainingDateInput.value;
    const trainingDate = parseDate(trainingDateInputValue);
    if (!(trainingNameInputValue && trainingDateInputValue)) {
        console.log("훈련 이름 또는 훈련 날짜가 입력되지 않았습니다.");
    } else if (!(trainingDate instanceof Date) || isNaN(trainingDate))  {
        console.log("알맞은 날짜가 아닙니다.");
    } else {
        const trainingName = trainingNameInputValue;
        const trainingDays = manageSetTrainingDays.setTrainingDays;
        if (!trainingDays) {
            console.log("저장된 일정 파일이 없어서 훈련을 새로 생성할 수 없습니다.");
        } else {
            const trainingObj = {
                name: trainingName,
                date: trainingDate,
                days: trainingDays
            };
            paintTraining(trainingObj, manageTrainings.trainings.length);
            manageTrainings.addTraining(trainingObj);
        }
    }
    trainingNameInput.value = "";
    trainingDateInput.value = "";
}

trainingDayList.classList.add(HIDDEN_CLASS_NAME);
manageTrainings.loadTrainings();
manageSetTrainingDays.loadSetTrainingDays();
manageTrainings.trainings.forEach((training, index) => {
    paintTraining(training, index);
});

addTrainingForm.addEventListener("submit", handleAddTrainingFormSubmit);