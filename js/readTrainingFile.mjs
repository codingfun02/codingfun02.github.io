import manageSetTrainingDays from "./manageSetTrainingDays.mjs";

const trainingFileInput = document.querySelector(".js-trainingFileInput");

class ReadTextFile {
    constructor(fileInput) {
        this.fileInput = fileInput;
        this.setEvent();
    }
    static textFileType = "text/plain";
    setEvent() {
        this.fileInput.addEventListener("change", this.checkFile.bind(this));
    }
    checkFile() {
        const files = this.fileInput.files;
        if (files.length === 0) {
            console.log("아무 파일도 입력되지 않았습니다.");
        } else {
            const file = files[0];
            if (!this.checkFileType.call(this, file)) {
                console.log("파일의 형식이 맞지 않습니다.");
            } else {
                this.readFile(file);
            }
        }
    }
    checkFileType(file) {
        return file.type === ReadTextFile.textFileType;
    }
    readFile(file) {
        const reader = new FileReader();
        reader.addEventListener("load", this.parser.bind(this, reader));
        reader.readAsText(file, 'utf-8');
    }
    parser(reader) {
        const result = reader.result;
        const lines = result.split("\n");
        let trainingDays = [];
        let end = lines.length;
        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i];
            let toDos = [];
            const toDoTexts = lines.slice(i + 1, end);
            toDoTexts.forEach(toDoText => {
                if (toDoText.startsWith("#")) {
                    toDos.push({
                        text: toDoText.substring(1),
                        isDone: true
                    });
                } else {
                    toDos.push({
                        text: toDoText,
                        isDone: false
                    });
                }
            });
            if (line.startsWith("D-")) {
                trainingDays.unshift({
                    text: line,
                    toDos
                });
                end = i;
            }
        }
        manageSetTrainingDays.setTrainingDays = trainingDays;
    }
}

new ReadTextFile(trainingFileInput);