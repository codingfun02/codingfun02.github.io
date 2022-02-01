const trainingPrintBtn = document.querySelector(".js-trainingPrintBtn"),
    trainingDayList = document.querySelector(".js-trainingDayList");

const TRAINING_NAME_SPAN_SELECTED_CLASS_NAME = "trainingNameSpanSelected";

function printElement(element) {
    document.body.innerHTML = "";
    document.body.appendChild(element);
    print();
    location.reload();
}

function handleTrainingPrintBtnClick() {
    const selectedTrainingSpan = document.getElementsByClassName(TRAINING_NAME_SPAN_SELECTED_CLASS_NAME)[0];
    if (selectedTrainingSpan) {
        printElement(trainingDayList);
    } else {
        console.log("현재 선택된 훈련이 없어서 할 일을 출력할 수 없습니다.");
    }
}

trainingPrintBtn.addEventListener("click", handleTrainingPrintBtnClick);