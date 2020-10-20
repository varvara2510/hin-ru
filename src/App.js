import React from 'react';
import './App.css';
import Database from './db';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.database = new Database();
    this.state = {
      addingWord: false,
      word: "",
      gender: "m",
      spellings: "",
      part_of_speech: "noun",
      meanings: [
        {
          meaning: "",
          examples: ""
        }
      ]
    };
  }

  addWord = event => {
    event.preventDefault();
    this.database.saveWord({
      word: this.state.word,
      gender: this.state.gender,
      spellings: this.state.spellings.split(','),
      part_of_speech: this.state.part_of_speech,
      meanings: this.state.meanings,
      status: "draft"
    })
  }

  updateInput = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  addMeaning = e => {
    this.setState({
      meanings: [
        ...this.state.meanings,
        {
          meaning: "",
          examples: ""
        }
      ]
    })
  }

  updateMeaning = (idx, value) => {
    let meanings = this.state.meanings;
    meanings[idx].meaning = value;
    this.setState({
      meanings: meanings
    })
  }

  updateMeaningExamples = (idx, value) => {
    let meanings = this.state.meanings;
    meanings[idx].examples = value;
    this.setState({
      meanings: meanings
    })
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
          <form onSubmit={this.addWord}>
            <div className="form-group">
              <label htmlFor="word">Слово</label>
              <input type="text" className="form-control" id="word" placeholder="हिंदी"
                required={ true } onChange={this.updateInput} />
            </div>
            <div className="form-group">
              <label htmlFor="spellings">Альтернативные написания</label>
              <input type="text" className="form-control" id="spellings" placeholder="हिंदी, हिन्दी" onChange={this.updateInput} />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Род</label>
              <select className="form-control" id="gender" onChange={this.updateInput}>
                <option value="f">мужской</option>
                <option value="m">женский</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="part_of_speech">Часть речи</label>
              <select className="form-control" id="part_of_speech" onChange={this.updateInput}>
                <option value="noun">существительное</option>
                <option value="adjective">прилагательное</option>
              </select>
            </div>
            <div className="form-group">
              <label>Значения</label>
              {
                this.state.meanings.map(
                  (value, index) => {
                    return (
                      <div className="input-group" key={ "meaning-input-group-" + index }>
                        <textarea className="form-control" id={ "meanings-" + index }
                          placeholder="хинди (язык)" rows="3" required={ true }
                          value={ value.meaning } onChange={event => this.updateMeaning(index, event.target.value)}>
                        </textarea>
                        <textarea className="form-control" id={ "meanings_example" + index }
                          placeholder="हम हिंदी बोलते हैं। Мы говорим на хинди." rows="3" required={ true }
                          value={ value.examples } onChange={event => this.updateMeaningExamples(index, event.target.value)}>
                        </textarea>
                        <div className="input-group-append">
                          {
                            (index === this.state.meanings.length - 1) ? (
                              <button className="btn btn-outline-secondary" type="button"
                                onClick={this.addMeaning}>
                                <i className="fas fa-plus"></i>
                              </button>
                            ) : ""
                          }
                        </div>
                      </div>
                    )
                  }
                )
              }
            </div>
            <div className="col-12 my-3 text-center">
              <button className="btn btn-outline-primary" type="submit">
                Отправить
              </button>
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
