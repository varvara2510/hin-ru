import React from 'react';
import './App.css';
import Database from './db';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.database = new Database();
    this.state = {
      addingWord: false,
      foundWords: [],
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

  searchWord = event => {
    this.database.searchWords(event.target.value).get().then(
      snapshot => {
        console.log("cool")
        this.setState({
          foundWords: snapshot.docs,
        })
      }
    )
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
              aria-label="Слово" aria-describedby="language-identifier" onChange={this.searchWord} />
          </div>
        </div>
        <div className="col-12">
          <div className="accordion" id="foundWords">
            {
              this.state.foundWords.map(
                (word, index) => (
                  <div className="card" key={ "search-result-" + index }>
                    <div className="card-header" id={ "word-" + index }>
                      <h2 className="mb-0">
                        <button className="btn btn-link btn-block text-left" type="button"
                          data-toggle="collapse" data-target={ "#collapse-word-" + index } aria-expanded="true"
                          aria-controls={ "collapse-word-" + index }>
                          { word.get("word") }
                        </button>
                      </h2>
                    </div>
                    <div id={ "collapse-word-" + index } className="collapse" aria-labelledby={ "word-" + index }
                      data-parent="#foundWords">
                      <div className="card-body">
                        <p>
                          Часть речи: { word.get("part_of_speech") }
                        </p>
                        <p>
                          Род: { word.get("gender") }
                        </p>
                        <p>
                          Альтернативные написания: { word.get("spellings") }
                        </p>
                        <p>
                          Значения: { word.get("meanings").map(
                            meaning => (
                              <p>
                                { meaning.meaning } ({ meaning.examples })
                              </p>
                            )
                          ) }
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )
            }
          </div>
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
