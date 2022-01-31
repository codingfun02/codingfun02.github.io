const SET_TRAINING_DAYS_LOCALSTORAGE_KEY = "setTrainingDays",
    HIDDEN_CLASS_NAME = "hidden";

const trainingDataAddedSpan = document.querySelector(".js-trainingDataAddedSpan");

class ManageSetTrainingDays {
    constructor(localStorageKey) {
        this.localStorageKey = localStorageKey;
        this._setTrainingDays = null;
    }

    get setTrainingDays() {
        return this._setTrainingDays;
    }

    set setTrainingDays(value) {
        this._setTrainingDays = value;
        this.saveSetTrainingDays.call(this);
    }

    loadSetTrainingDays() {
        const loadedSetTrainingDays = localStorage.getItem(this.localStorageKey);
        if (!loadedSetTrainingDays) {
            console.log("저장된 기본 일정 파일이 없습니다.");
        } else {
            trainingDataAddedSpan.classList.remove(HIDDEN_CLASS_NAME);
            const parsedSetTrainingDays = JSON.parse(loadedSetTrainingDays);
            this._setTrainingDays = parsedSetTrainingDays;
        }
    }

    saveSetTrainingDays() {
        trainingDataAddedSpan.classList.remove(HIDDEN_CLASS_NAME);
        const stringifiedSetTrainingDays = JSON.stringify(this._setTrainingDays);
        localStorage.setItem(this.localStorageKey, stringifiedSetTrainingDays);
    }
}

const manageSetTrainingDays = new ManageSetTrainingDays(SET_TRAINING_DAYS_LOCALSTORAGE_KEY);

export default manageSetTrainingDays;