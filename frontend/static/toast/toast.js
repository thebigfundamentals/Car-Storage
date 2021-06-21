const Toast = {
    init() {
        this.hideTimeout = null;

        this.el = document.createElement('div');
        this.el.className = 'toastNotification';
        document.body.appendChild(this.el);
    },

    show(message, state) {
        clearTimeout(this.hideTimeout);

        this.el.textContent = message;
        this.el.className = 'toastNotification toastNotification--visible';

        if (state) {
            this.el.classList.add(`toastNotification--${state}`);
        }

        this.hideTimeout = setTimeout(() => {
            this.el.classList.remove('toastNotification--visible')
        }, 1500);
    }
};

document.addEventListener('DOMContentLoaded', () => Toast.init());

export default Toast;

