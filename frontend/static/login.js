import Toast from "./toast/toast.js";

const urlParams = new URLSearchParams(window.location.search);
const info = urlParams.get('info');

if (info) {
    Toast.init();
    Toast.show('Dados incorretos', 'excluded');
}


