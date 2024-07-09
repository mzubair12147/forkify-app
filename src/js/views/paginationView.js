import icons from 'url:../../img/icons.svg';
import View from './view';

class paginationView extends View {
    _parentElement = document.querySelector('.pagination');

    _generateMarkup() {
        const numPages = Math.ceil(
            this._data.result.length / this._data.resultPerPage
        );
        const currentPage = this._data.page;

        if (currentPage == 1 && numPages > 1) {
            return `
            <button data-goto="${
                currentPage + 1
            }" class="btn--inline pagination__btn--next">
            <span>page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
            `;
        }

        if (currentPage === numPages && numPages > 1) {
            return `
            <button data-goto="${
                currentPage - 1
            }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>page ${currentPage - 1}</span>
          </button>
            `;
        }

        if (currentPage < numPages) {
            return `
            <button data-goto="${
                currentPage - 1
            }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>page ${currentPage - 1}</span>
          </button>
          <button  class="btn--inline pagination__btn--next" data-goto="${
            currentPage + 1
        }">
            <span>page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
            `;
        }

        // page 1 and no other pages.
        return '';
    }

    addHandlerPagination(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline');
            console.log(btn);
            if (!btn) return;
            const gotoPage = +btn.dataset.goto;
            handler(gotoPage);
        });
    }
}

export default new paginationView();
