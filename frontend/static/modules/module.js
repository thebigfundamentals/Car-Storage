import DOMVariables from "./DOMVariables.js";
import Toast from "../toast/toast.js";

let _carCounter = 0;
let deleteBtnActivated; //delete button is 'hidden' by default, only appears after the first car is registered

class CarCreator {
    constructor(id, carImage, brandModel, year, plate, color) {
        this.id = id;
        this.carImage = callbacks.getValue(carImage);
        this.brandModel = callbacks.getValue(brandModel).toUpperCase();
        this.year = callbacks.getValue(year);
        this.plate = callbacks.getValue(plate).toUpperCase();
        this.color = callbacks.getValue(color).toLowerCase();
    }
};

const callbacks = {

    createNewCarModel() {
        let $newCar = DOMVariables.carDefault.cloneNode(true);

        const ID = function () {
            return '_' + Math.random().toString(36).substr(2, 9);
        };
        const createdCar = new CarCreator(ID(), DOMVariables.$carImage, DOMVariables.$brandModel, DOMVariables.$year, DOMVariables.$plate, DOMVariables.$color);

        return {
            $newCar,
            ID,
            createdCar
        }
    },

    async addCar() {

        const newCarModel = callbacks.createNewCarModel();

        if (callbacks.areFieldsEmpty()) {
            alert('Por favor, preencha todos os campos.')
            return;
        }

        else {

            if (_carCounter === 0) {


                let sentImage = document.createElement('img');
                sentImage.setAttribute('class', 'sentImage');
                sentImage.src = newCarModel.createdCar.carImage;
                let $carImageOutput = newCarModel.$newCar.querySelector('.carImageOutput');
                $carImageOutput.appendChild(sentImage);

                newCarModel.$newCar.querySelector('.brandModelOutput').textContent = newCarModel.createdCar.brandModel;
                newCarModel.$newCar.querySelector('.yearOutput').textContent = newCarModel.createdCar.year;
                newCarModel.$newCar.querySelector('.plateOutput').textContent = newCarModel.createdCar.plate;
                newCarModel.$newCar.querySelector('.colorOutput').textContent = newCarModel.createdCar.color;

                newCarModel.$newCar.setAttribute(`id`, `${newCarModel.createdCar.id}`);

                DOMVariables.$carList.appendChild(newCarModel.$newCar);
                DOMVariables.$carElement().style.display = 'none';
                ++_carCounter;

            }

            else {

                let $lastCar = document.querySelector('.output').firstElementChild;

                let sentImage = document.createElement('img');
                sentImage.setAttribute('class', 'sentImage');
                sentImage.src = newCarModel.createdCar.carImage;
                let $carImageOutput = newCarModel.$newCar.querySelector('.carImageOutput');
                $carImageOutput.removeChild($carImageOutput.lastChild);
                $carImageOutput.appendChild(sentImage);

                newCarModel.$newCar.querySelector('.brandModelOutput').textContent = newCarModel.createdCar.brandModel;
                newCarModel.$newCar.querySelector('.yearOutput').textContent = newCarModel.createdCar.year;
                newCarModel.$newCar.querySelector('.plateOutput').textContent = newCarModel.createdCar.plate;
                newCarModel.$newCar.querySelector('.colorOutput').textContent = newCarModel.createdCar.color;

                newCarModel.$newCar.setAttribute('id', `${newCarModel.createdCar.id}`);

                DOMVariables.$carList.insertBefore(newCarModel.$newCar, $lastCar);
                ++_carCounter;
            }

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCarModel.createdCar),
            };

            const response = await fetch('/api', options);
            const data = await response.json();
            console.log(data);

            callbacks.clearInput();
            deleteBtnActivated = DOMVariables.deleteBtnGetter();
            deleteBtnActivated.forEach(selected => selected.removeAttribute('hidden'));

            Toast.show('Carro adicionado com sucesso!', 'added');

            return callbacks.activateDeleteBtn();
        }
    },

    async deleteCar() {

        let confirmar = confirm('Você tem certeza de que deseja deletar este veículo? Esta ação não poderá ser desfeita.');

        if (!confirmar) {
            return
        }

        else {

            const idToRemove = { id: this.parentNode.parentNode.id };

            if (_carCounter - 1 === 0) {

                this.parentNode.parentNode.remove();
                DOMVariables.$carElement().style.display = 'initial';
                deleteBtnActivated.forEach(selected => selected.setAttribute('hidden', ''));
                --_carCounter
            }

            else {
                this.parentNode.parentNode.remove();
                --_carCounter
            }

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(idToRemove)
            };
            try {
                const response = await fetch('/removeApi', options);
                const data = await response.json();
                console.log(data)
            } catch (e) {
                console.log(e)
            }
        }

        Toast.show('Carro excluído com sucesso.', 'excluded');
    },

    areFieldsEmpty() {
        return !callbacks.getValue(DOMVariables.$carImage) || !callbacks.getValue(DOMVariables.$brandModel) || !callbacks.getValue(DOMVariables.$year) || !callbacks.getValue(DOMVariables.$plate) || !callbacks.getValue(DOMVariables.$color)
    },

    getValue(element) {
        return element.value
    },

    clearInput() {
        document.querySelector('form').reset();
    },

    activateDeleteBtn() {
        return deleteBtnActivated.forEach(selected => selected.addEventListener('click', callbacks.deleteCar, false));
    }
};

async function loadDatabase() {
    try {
        const response = await fetch('/api');
        const data = await response.json();
        return data
    } catch (e) {
        console.log(e)
    }
};

const loadDatabaseResult = () => {
    loadDatabase().then(
        (data) => {
            if (data.length !== 0) {
                for (const carDatabase of data) {

                    let $newCar = DOMVariables.carDefault.cloneNode(true);

                    if (_carCounter === 0) {

                        let sentImage = document.createElement('img');
                        sentImage.setAttribute('class', 'sentImage');
                        sentImage.src = carDatabase.carImage;
                        let $carImageOutput = $newCar.querySelector('.carImageOutput');
                        $carImageOutput.appendChild(sentImage);

                        $newCar.querySelector('.brandModelOutput').textContent = carDatabase.brandModel;
                        $newCar.querySelector('.yearOutput').textContent = carDatabase.year;
                        $newCar.querySelector('.plateOutput').textContent = carDatabase.plate;
                        $newCar.querySelector('.colorOutput').textContent = carDatabase.color;

                        $newCar.setAttribute('id', `${carDatabase.id}`);

                        DOMVariables.$carList.appendChild($newCar);
                        DOMVariables.$carElement().style.display = 'none';
                        ++_carCounter;


                    }

                    else {
                        let $lastCar = document.querySelector('.output').firstElementChild;

                        let sentImage = document.createElement('img');
                        sentImage.setAttribute('class', 'sentImage');
                        sentImage.src = carDatabase.carImage;
                        let $carImageOutput = $newCar.querySelector('.carImageOutput');
                        $carImageOutput.removeChild($carImageOutput.lastChild);
                        $carImageOutput.appendChild(sentImage);

                        $newCar.querySelector('.brandModelOutput').textContent = carDatabase.brandModel;
                        $newCar.querySelector('.yearOutput').textContent = carDatabase.year;
                        $newCar.querySelector('.plateOutput').textContent = carDatabase.plate;
                        $newCar.querySelector('.colorOutput').textContent = carDatabase.color;

                        $newCar.setAttribute('id', `${carDatabase.id}`);

                        DOMVariables.$carList.insertBefore($newCar, $lastCar);
                        ++_carCounter;
                    }
                    deleteBtnActivated = DOMVariables.deleteBtnGetter();
                    deleteBtnActivated.forEach(selected => selected.removeAttribute('hidden'));
                }
                DOMVariables.$loading.setAttribute('hidden', '');
                return callbacks.activateDeleteBtn();
            }
            DOMVariables.$loading.setAttribute('hidden', '');
        }
    )
};

export { callbacks, loadDatabaseResult }