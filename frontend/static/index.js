import DOMVariables from './modules/DOMVariables.js'
import { callbacks, loadDatabaseResult } from './modules/module.js';

loadDatabaseResult();

document.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        DOMVariables.$registerBtn.click();
    }
});

DOMVariables.$registerBtn.addEventListener('click', callbacks.addCar, false);
DOMVariables.$clearBtn.addEventListener('click', callbacks.clearInput, false);