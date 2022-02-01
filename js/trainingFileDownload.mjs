import manageTrainings from "./manageTrainings.mjs";

const trainingDownloadBtn = document.querySelector(".js-trainingDownloadBtn");

const TRAINING_NAME_SPAN_SELECTED_CLASS_NAME = "trainingNameSpanSelected",
    TRAINING_FILENAME = "훈련 데이터",
    TRAINING_FILE_TYPE = "text/plain";

function downloadFile(data, filename, type) {
    const file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        const a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function parseTrainingDay(trainingDay) {
    let trainingDayData = "";
    trainingDayData += `${trainingDay.text}\n`;
    trainingDay.toDos.forEach((toDo) => {
        trainingDayData += `${toDo.isDone ? "#" : ""}${toDo.text}\n`;
    });
    return trainingDayData;
}

function handleTrainingDownloadBtnClick() {
    const selectedTrainingSpan = document.getElementsByClassName(TRAINING_NAME_SPAN_SELECTED_CLASS_NAME)[0];
    if (selectedTrainingSpan) {
        const div = selectedTrainingSpan.parentElement;
        const li = div.parentElement;
        const trainingId = Number(li.dataset.trainingId);
        const training = manageTrainings.trainings[trainingId];
        const trainingDays = training.days;
        let trainingData = "";
        trainingDays.forEach(trainingDay => {
            trainingData += parseTrainingDay(trainingDay);
        });
        downloadFile(trainingData, TRAINING_FILENAME, TRAINING_FILE_TYPE);
    } else {
        console.log("선택된 훈련이 없어서 훈련 데이터 파일을 만들 수 없습니다.");
    }
}

trainingDownloadBtn.addEventListener("click", handleTrainingDownloadBtnClick);