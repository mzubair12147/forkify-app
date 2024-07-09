import icons from 'url:../../img/icons.svg';
export default class View {
    _data;
    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0))
            return this.renderError();

        // console.log("the current page is: " + this._data.page);
        this._data = data;
        const htmlMarkup = this._generateMarkup();
        if(!render) return htmlMarkup;

        this._clearParent();
        this._parentElement.insertAdjacentHTML('afterbegin', htmlMarkup);
    }

    update(data) {
      // if (!data || (Array.isArray(data) && data.length === 0))
      // return this.renderError();
    
        // console.log("the current page is: " + this._data.page);
        this._data = data;
        const newMarkup = this._generateMarkup();
        
        // this will create a new DOM. like a virtual DOM.
        const newDOM = document
        .createRange()
        .createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const currElements = Array.from(this._parentElement.querySelectorAll('*'));
        
        newElements.forEach((elem, i) => {
          const currElem = currElements[i];
            if(!elem.isEqualNode(currElem) && elem?.firstChild?.nodeValue.trim() !== ''){
              currElem.textContent = elem.textContent;
            }

            if(!elem.isEqualNode(currElem)){
              Array.from(elem.attributes).forEach(attrib=>{
                currElem.setAttribute(attrib.name,attrib.value);
              })
            }
        });
    }

    _clearParent() {
        this._parentElement.innerHTML = '';
    }

    renderSpinner() {
        const spinHtmlMarkup = `<div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;

        this._parentElement.innerHTML = '';
        this._parentElement.innerHTML = spinHtmlMarkup;
    }

    renderError(msg = this._errorMessage) {
        const errorMarkup = `<div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${msg}</p>
        </div>
    `;
        this._clearParent();
        this._parentElement.insertAdjacentHTML('afterbegin', errorMarkup);
    }

    renderMessage(msg = this._message) {
        const messageMarkup = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${msg}</p>
  </div>`;
        this._clearParent();
        this._parentElement.insertAdjacentHTML('afterbegin', messageMarkup);
    }
}
