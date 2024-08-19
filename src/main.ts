import './style.css'
import {
  addProduct,
  addToCart,
  removeFromCart,
  calculateTotal,
  clearCart,
  applyShippingDiscount
} from './ecommerce'

class ProductList extends HTMLElement {
  products: Element | null | undefined;
  identifier: string;

  constructor() {
    // establish prototype chain
    super();

    // attaches shadow tree and returns shadow root reference
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
    const shadow = this.attachShadow({ mode: 'open' });

    // creating a container for the editable-list component
    const productListContainer = document.createElement('div');

    // get attribute values from getters
    const title = this.title;
    const addItemText = this.addItemText;
    const listFields = this.fields;
    this.identifier = self.crypto.randomUUID();

    this.products = null;

    // adding a class to our container for the sake of clarity
    productListContainer.classList.add('editable-list');

    // creating the inner HTML of the editable list element
    productListContainer.innerHTML = `
      <h3>${title}</h3>
      <ul class="item-list">
      </ul>
      <div id="fields-${this.identifier}">
        ${listFields?.map(field => {
          const classname = field.toLocaleLowerCase().replace(' ', '-');
          return `
            <div class="input-field">
              <label for="${classname}">${field}</label>
              <input name="${classname}" class="${classname}" type="text">
            </div>
          `;
        }).join('')}
        <button class="editable-list-add-item">${addItemText}</button>
      </div>
    `;

    // binding methods
    this.addListItem = this.addListItem.bind(this);
    this.handleRemoveItemListeners = this.handleRemoveItemListeners.bind(this);
    this.removeListItem = this.removeListItem.bind(this);

    // appending the container to the shadow DOM
    shadow.appendChild(productListContainer);
  }

  // add items to the list
  addListItem() {
    if (!this.shadowRoot) { console.error('shadow DOM not available yet in addListItem'); return; };
    const inputs: NodeListOf<HTMLDivElement> | null = this.shadowRoot.querySelectorAll(`#fields-${this.identifier} .input-field`);

    // extract data and render
    const ul = document.createElement('ul');
    inputs.forEach(e => {
      const label = e.children[0] as HTMLLabelElement;
      const input = e.children[1] as HTMLInputElement;
      const fieldKey = label.innerHTML;
      const fieldValue = input.value;
      
      const li = document.createElement('li');
      li.textContent = `${fieldKey}: ${fieldValue}`;
      ul.appendChild(li);
    });

    const rootLi = document.createElement('li');
    rootLi.appendChild(ul);
    
    const removeButton = document.createElement('button');
    removeButton.classList.add('editable-list-remove-item', 'icon');
    removeButton.innerHTML = '❌';
    
    const cartButton = document.createElement('button');
    cartButton.classList.add('editable-list-add-cart', 'icon');
    cartButton.innerHTML = '🛒';

    if (this.products) {
      const childrenLength = this.products.children.length;
      this.products.appendChild(rootLi);
      this.products.children[childrenLength].appendChild(removeButton);
      this.products.children[childrenLength].appendChild(cartButton);
    } else {
      console.error('products not found in shadow DOM');
    }
    this.handleRemoveItemListeners([removeButton]);
    this.handleAddCartListeners([cartButton]);
  }

  // fires after the element has been attached to the DOM
  connectedCallback() {
    if (!this.shadowRoot) { console.error('shadow DOM not available yet in ConnectedCallback'); return; };

    const removeElementButtons = [...this.shadowRoot.querySelectorAll('.editable-list-remove-item')];
    const addElementButton = this.shadowRoot.querySelector('.editable-list-add-item');

    this.products = this.shadowRoot.querySelector('.item-list');

    this.handleRemoveItemListeners(removeElementButtons);
    addElementButton?.addEventListener('click', this.addListItem, false);
  }

  // gathering data from element attributes
  get title() {
    return this.getAttribute('title') || '';
  }

  get items(): string[] {
    const items: string[] = [];

    [...this.attributes].forEach(attr => {
      if (attr.name.includes('list-item')) {
        items.push(attr.value);
      }
    });

    return items;
  }

  get fields(): string[] {
    const fields: string[] = [];

    [...this.attributes].forEach(attr => {
      if (attr.name.includes('field')) {
        fields.push(attr.value);
      }
    });

    return fields;
  }

  get addItemText() {
    return this.getAttribute('add-item-text') || '';
  }

  handleRemoveItemListeners(arrayOfElements: Element[]) {
    arrayOfElements.forEach(element => {
      element.addEventListener('click', this.removeListItem, false);
    });
  }

  removeListItem(e: Event) {
    const parent = ( <HTMLElement>( <HTMLElement>e.target ).parentNode );
    parent.remove();
  }

  handleAddCartListeners(arrayOfElements: Element[]) {
    arrayOfElements.forEach(element => {
      element.addEventListener('click', this.addToCart, false);
    });
  }

  addToCart(e: Event) {
    // TODO: Find Shopping Cart List
    // TODO: Add to Shopping Cart List
    // const parent = ( <HTMLElement>( <HTMLElement>e.target ).parentNode );
    // parent.remove();
  }
}

// let the browser know about the custom element
customElements.define('editable-list', ProductList);