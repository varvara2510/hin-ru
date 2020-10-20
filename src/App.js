import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addingWord: false,
    };
  }

  render() {
    let wordSearchForm = (
      <div className="row">
        <div className="col-12">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="language-identifier">HIN/RU</span>
            </div>
            <input type="text" className="form-control" placeholder="Найти слово..."
              aria-label="Слово" aria-describedby="language-identifier" />
          </div>
        </div>
        <div className="col-12">
          <ul className="list-group w-100">
            <li className="list-group-item list-group-item-action">Word 1</li>
            <li className="list-group-item list-group-item-action">Word 2</li>
            <li className="list-group-item list-group-item-action">Word 3</li>
          </ul>
        </div>
      </div>
    );

    let wordAddForm = (
      <div className="row">
        <div className="col-12">
          <form>
            <div className="form-group">
              <label htmlFor="word">Слово</label>
              <input type="text" className="form-control" id="word" placeholder="हिंदी" />
            </div>
            <div className="form-group">
              <label htmlFor="spellings">Альтернативные написания</label>
              <input type="text" className="form-control" id="spellings" placeholder="हिंदी, हिन्दी" />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Род</label>
              <select className="form-control" id="gender">
                <option value="f">мужской</option>
                <option value="m">женский</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="part_of_speech">Часть речи</label>
              <select className="form-control" id="part_of_speech">
                <option value="noun">существительное</option>
                <option value="adjective">прилагательное</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="meanings">Значения</label>
              <div className="input-group">
                <textarea className="form-control" id="meanings"
                  placeholder="хинди (язык)" rows="3"></textarea>
                <textarea className="form-control" id="meanings_example"
                  placeholder="हम हिंदी बोलते हैं। Мы говорим на хинди." rows="3"></textarea>
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="button">
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              <div className="col-12 my-3 text-center">
                <button className="btn btn-outline-primary" type="button">
                  Отправить
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );

    return (
      <div className="container">
        <div className="row">
          <div className="col-12 my-3 text-center">
            <button className="btn btn-primary" onClick={
              () => this.setState({
                addingWord: !this.state.addingWord
              })
            }>
              { this.state.addingWord ? "Искать слова" : "Добавить слово"}
            </button>
          </div>
        </div>
        { this.state.addingWord ? wordAddForm : wordSearchForm }
      </div>
    );
  } 
}

export default App;
