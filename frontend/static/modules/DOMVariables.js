const DOMVariables = {
    $carImage: document.querySelector('#carImage'),
    $brandModel: document.querySelector('#brandModel'),
    $year: document.querySelector('#year'),
    $plate: document.querySelector('#plate'),
    $color: document.querySelector('#color'),
    $registerBtn: document.querySelector('#register'),
    $clearBtn: document.querySelector('#clear'),
    $loading: document.querySelector('.loading'),
    carDefault: document.querySelector('.car').cloneNode(true),
    $carElement() { return document.querySelector('.car') },
    $carList: document.querySelector('.output'),
    deleteBtnGetter() { return document.querySelectorAll('#delete') },
};

export default DOMVariables