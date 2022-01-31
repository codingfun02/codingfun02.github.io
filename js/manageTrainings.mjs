const TRAININGS_LOCAL_STORAGE_KEY = "trainings";

class ManageTrainings {
    constructor(localStorageKey) {
        this.localStorageKey = localStorageKey;
        this.trainings = [];
    }

    loadTrainings() {
        const loadedTrainings = localStorage.getItem(this.localStorageKey);
        if (!loadedTrainings) {
            console.log("저장된 일정 파일이 없습니다.");
        } else {
            const parsedTrainings = JSON.parse(loadedTrainings);
            this.trainings = parsedTrainings;
        }
    }

    saveTrainings() {
        const stringifiedTrainings = JSON.stringify(this.trainings);
        localStorage.setItem(this.localStorageKey, stringifiedTrainings);
    }

    addTraining(training) {
        this.trainings.push(training);
        this.saveTrainings.call(this);
    }

    deleteTraining(trainingNumber) {
        this.trainings.splice(trainingNumber, 1);
        this.saveTrainings.call(this);
    }

    editTraining(trainingNumber, dayNumber, toDoNumber, isDone) {
        this.trainings[trainingNumber].days[dayNumber].toDos[toDoNumber].isDone = isDone;
        this.saveTrainings.call(this);
    }
}

const manageTrainings = new ManageTrainings(TRAININGS_LOCAL_STORAGE_KEY);

export default manageTrainings;