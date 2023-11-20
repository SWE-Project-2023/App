document.addEventListener('DOMContentLoaded', function () {
    const productInfoAccordion = document.querySelector('.product_item_descrp .contextbox');
    const deliveryAccordion = document.querySelector('.product_item_delivery .contextbox');

    productInfoAccordion.addEventListener('click', function (event) {
        this.classList.toggle('active');

        const detailsBlock = this.querySelector('.details_block');
        if (this.classList.contains('active')) {
            detailsBlock.style.height = detailsBlock.scrollHeight + 'px';
            this.querySelector("i").classList.replace("fa-plus","fa-minus");
        } else {
            detailsBlock.style.height = '0';
            this.querySelector("i").classList.replace("fa-minus","fa-plus");
        }
    });

    deliveryAccordion.addEventListener('click', function (event) {
        this.classList.toggle('active');

        const detailsBlock = this.querySelector('.details_block');
        if (this.classList.contains('active')) {
            detailsBlock.style.height = detailsBlock.scrollHeight + 'px';
            this.querySelector("i").classList.replace("fa-plus","fa-minus");

        } else {
            detailsBlock.style.height = '0';
            this.querySelector("i").classList.replace("fa-minus","fa-plus");

        }
    });
});
function increment() {
    const quantityInput = document.getElementById('quantity_value');
    let currentValue = parseInt(quantityInput.value, 10);
    
    if (!isNaN(currentValue)) {
        currentValue++;
        quantityInput.value = currentValue;
    }
    console.log("hhh")
}

function decrement() {
    const quantityInput = document.getElementById('quantity_value');
    let currentValue = parseInt(quantityInput.value, 10);
    
    if (!isNaN(currentValue) && currentValue > 1) {
        currentValue--;
        quantityInput.value = currentValue;
    }
    console.log("heh")
}
