import View from './view';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class resultView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for your query, Search something else!';
    _message = '';

    _generateMarkup() {
      return this._data.map(res => previewView.render(res,false)).join('');
  }
}

export default new resultView();
