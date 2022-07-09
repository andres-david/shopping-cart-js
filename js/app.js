const cards = document.querySelector( '#cards' );
const items = document.querySelector( '#items' );
const footer = document.querySelector( '#footer' );

const templateCard = document.querySelector('#template-card').content;
const templateFooter = document.querySelector( '#template-footer' ).content;
const templateCart = document.querySelector( '#template-carrito' ).content;

const fragment = document.createDocumentFragment();

let cart = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchData();

    if(localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem('cart'));
        printCart();
    }
});

cards.addEventListener('click', e => {

    addCart(e);

});

items.addEventListener('click', e => {
    btnAction(e);
});


const fetchData = async () => {

    try {
        const resp = await fetch('api.json');
        const data = await resp.json();

        printCards( data ) ;       
    }
    catch (error){
        console.error(error);
    }

}

const printCards = data => {

    data.forEach(element => {

        templateCard.querySelector( 'h5' ).textContent = element.title;
        
        templateCard.querySelector( 'p' ).textContent = element.precio;

        templateCard.querySelector( 'img' ).setAttribute('src', element.thumbnailUrl);

        templateCard.querySelector( '.btn-dark' ).dataset.id = element.id;

        const clone = templateCard.cloneNode(true);

        fragment.appendChild( clone );
        
    });

    cards.appendChild( fragment );

}

const addCart = e => {
    
    if(e.target.classList.contains('btn-dark')){

        setCart(e.target.parentElement)

    }

    e.stopPropagation();

}

const setCart = obj => {

    const product = {
        id: obj.querySelector('.btn-dark').dataset.id,
        title: obj.querySelector('h5').textContent,
        price: obj.querySelector('p').textContent,
        amount: 1,
    }

    if(cart.hasOwnProperty(product.id)){
        product.amount = cart[product.id].amount + 1;
    }

    cart[product.id] = {...product};

    printCart();
    
}

const printCart = () => {

    items.innerHTML = '';

    Object.values(cart).forEach( product => {

        templateCart.querySelector( 'th' ).textContent = product.id;

        templateCart.querySelectorAll( 'td' )[0].textContent = product.title;

        templateCart.querySelectorAll( 'td' )[1].textContent = product.amount;

        templateCart.querySelector('.btn-info').dataset.id = product.id;

        templateCart.querySelector( '.btn-danger' ).dataset.id = product.id;

        templateCart.querySelector( 'span' ).textContent = product.amount * product.price;

        const clone = templateCart.cloneNode( true );

        fragment.appendChild( clone );

    });

    items.appendChild( fragment );

    printFooter();

    localStorage.setItem('cart', JSON.stringify(cart));

}

const printFooter = () => {

    footer.innerHTML = '';

    if( Object.keys(cart).length === 0 ){

        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `

        return;
    }

    const nAmount = Object.values( cart ).reduce( (acc, {amount}) => acc + amount, 0);
    const nPrice = Object.values( cart ).reduce((acc,{amount, price}) => acc + amount * price, 0 );

    templateFooter.querySelectorAll('td')[0].textContent = nAmount;

    templateFooter.querySelector('span').textContent = nPrice;

    const clone = templateFooter.cloneNode(true);

    fragment.appendChild( clone );

    footer.appendChild( fragment );

    const btnClear = document.querySelector('#vaciar-carrito');

    btnClear.addEventListener('click', () => {

        cart = {};

        printCart();

    })


}

const btnAction = e => {

    if( e.target.classList.contains('btn-info') ){
        console.log(cart[e.target.dataset.id]);

        const product = cart[e.target.dataset.id];

        product.amount++;

        cart[e.target.dataset.id] = {...product};

        printCart();
    }

    if ( e.target.classList.contains('btn-danger')){

        const product = cart[e.target.dataset.id];

        product.amount--;

        if( product.amount === 0 ){

            delete cart[e.target.dataset.id];

        }

        printCart();

    }

    e.stopPropagation();

}

