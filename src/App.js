import React from 'react';
import './App.css';
import Database from './db';
import firebase from 'firebase';
import DevanagariTextInput from './devanagari';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.database = new Database();
    this.state = this.getCleanState();
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user });
        this.database.fetchUserAdmin(
          user,
          value => this.setState({ userIsAdmin: value })
        );
      }
    });
  }

  getCleanState = () => (
    {
      currentRoute: "main-page",
      upload_status: "not_started",
      foundWords: [],
      word: "",
      spellings: "",
      part_of_speech: "noun",
      meanings: [
        {
          meaning: "",
          examples: ""
        }
      ],
      control_rus: "",
      control_hin: "",
      stable_phrases_rus: "",
      stable_phrases_hin: "",
      examples_rus: "",
      examples_hin: "",
      user: undefined,
      userIsAdmin: false
    }
  )

  resetState = () => this.setState(
    {
      ...this.getCleanState(),
      addingWord: this.state.addingWord
    }
  );

  signIn = () => {
    let authProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(
      () => {
        firebase.auth().signInWithPopup(authProvider).then(
          result => {
            this.setState({user: result.user});
            this.database.fetchUserAdmin(
              result.user,
              value => this.setState({userIsAdmin: value})
            )
          }
        );
      }
    )
  }

  routeTo = route => this.setState({currentRoute: route})

  signOut = () => {
    firebase.auth().signOut();
    this.setState({ user: undefined, userIsAdmin: false });
  }

  setUploadingWord = () => this.setState({upload_status: "pending"});
  setSomethingWentWrong = () => this.setState({upload_status: "error"});

  addWord = event => {
    event.preventDefault();
    this.setUploadingWord();
    this.database.saveWord({
      word: this.state.word,
      spellings: this.state.spellings.split(','),
      part_of_speech: this.state.part_of_speech,
      meanings: this.state.meanings,
      properties: this.state.properties ? this.state.properties : {},
      control: {
        rus: this.state.control_rus,
        hin: this.state.control_hin
      },
      stable_phrases: {
        rus: this.state.stable_phrases_rus,
        hin: this.state.stable_phrases_hin
      },
      examples: {
        rus: this.state.examples_rus,
        hin: this.state.examples_hin
      },
      status: "draft",
      author: this.state.user ? this.state.user.email : undefined
    }).then(
      this.resetState
    ).catch(
      this.setSomethingWentWrong
    )
  }

  searchWord = event => {
    this.database.searchWords(event.target.value).get().then(
      snapshot => {
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

  updateProperty = (propName, valueName, value) => {
    this.setState({
      properties: {
        ...(
          this.state.properties
            ? this.state.properties
            : {}
        ),
        [propName]: {
          ...(
            (this.state.properties && propName in this.state.properties)
            ? this.state.properties[propName]
            : {}
          ),
          [valueName]: value
        }
      }
    })
  }

  getPartsOfSpeech = () => {
    return {
      noun: "существительное",
      verb: "глагол",
      compound_verb: "составной глагол",
      adjective: "прилагательное",
      adverb: "наречие",
      pronoun: "местоимение",
      conjunction: "союз",
      interjection: "междометие",
      postposition: "послелог",
      particle: "частица"
    }
  }

  getPropertiesForPartOfSpeech = partOfSpeech => {
    let propertiesByPartOfSpeech = {
      noun: [
        {
          name: "gender",
          readableName: "Род",
          values: [
            {name: "m", readableName: "мужской"},
            {name: "f", readableName: "женский"},
          ]
        }
      ],
      verb: [
        {
          name: "transitivity",
          readableName: "Переходность",
          values: [
            {name: "transitive", readableName: "переходный"},
            {name: "non_transitive", readableName: "непереходный"},
          ]
        }
      ],
      compound_verb: [
        {
          name: "transitivity",
          readableName: "Переходность",
          values: [
            { name: "transitive", readableName: "переходный" },
            { name: "non_transitive", readableName: "непереходный" },
          ]
        },
        {
          name: "compound_of",
          readableName: "Состоит из",
          values: [
            { name: "noun_and_verb", readableName: "существительного и глагола" },
            { name: "adjective_and_verb", readableName: "прилагательного и глагола" },
            { name: "participle_and_verb", readableName: "причастия и глагола" },
          ]
        }
      ],
      adjective: [
        {
          name: "mutability",
          readableName: "Изменяемость",
          values: [
            { name: "mutable", readableName: "изменяемое" },
            { name: "immutable", readableName: "неизменяемое" },
          ]
        }
      ],
      adverb: [],
      pronoun: [
        {
          name: "order",
          readableName: "Разряд",
          values: [
            { name: "personal", readableName: "личное" },
            { name: "demonstrative", readableName: "указательное" },
            { name: "relative", readableName: "относительное" },
            { name: "indefinite", readableName: "неопределенное" },
            { name: "interrogative", readableName: "вопросительное" },
          ]
        },
        {
          name: "gender",
          readableName: "Род",
          values: [
            { name: "m", readableName: "мужской" },
            { name: "f", readableName: "женский" },
          ]
        }
      ],
      conjunction: [],
      interjection: [],
      postposition: [],
      particle: [],
    }
    return propertiesByPartOfSpeech[partOfSpeech];
  }

  getPage = () => {
    switch (this.state.currentRoute) {
      case "main-page":
        return this.renderMainPage();
      case "add-word":
        return this.renderWordAddForm();
      case "admin-panel":
        return "ADMIN PANEL UNDER CONSTRUCTION";
      default:
        return this.renderMainPage();
    }
  }

  renderWord = word => {
    return (
      <table className="table">
        <tbody>
          <tr>
            <th>Часть речи</th>
            <td>
              { this.getPartsOfSpeech()[word.get("part_of_speech")] }
            </td>
          </tr>
          {
            this.getPropertiesForPartOfSpeech(word.get("part_of_speech")).map(
              property => (
                <tr key={ word.get("word") + '-' + property.name }>
                  <th>{ property.readableName }</th>
                  <td>
                    {
                      (word.get("properties") && property.name in word.get("properties")) ?
                        Object.entries(
                          word.get("properties")[property.name]
                        ).filter(([_, value]) => value).map(
                          ([key, _]) => property.values.filter(
                              value => (value.name === key)
                            )[0].readableName
                        ) : "-"
                    }
                  </td>
                </tr>
              )
            )
          }
          <tr>
            <th>Альтернативные написания</th>
            <td>{word.get("spellings")}</td>
          </tr>
          <tr>
            <th>Управление</th>
            <td>{word.get("control_rus")}</td>
            <td>{word.get("control_hin")}</td>
          </tr>
          <tr>
            <th>Устойчивые словосочетания</th>
            <td>{word.get("stable_phrases_rus")}</td>
            <td>{word.get("stable_phrases_hin")}</td>
          </tr>
          <tr>
            <th>Примеры</th>
            <td>{word.get("examples_rus")}</td>
            <td>{word.get("examples_hin")}</td>
          </tr>
          <tr>
            <th>Значения</th>
            <td>
              <table className="table">
                {
                  word.get("meanings").map(
                    meaning => (
                      <tr>
                        <td>{meaning.meaning}</td>
                        <td>{meaning.examples}</td>
                      </tr>
                    )
                  )
                }
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

  renderMainPage = () => {
    return (
      <div className="row my-4">
        <div className="col-12">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="language-identifier">Hin/Ru</span>
            </div>
            <input type="text" className="form-control" placeholder="Найти слово..."
              aria-label="Слово" aria-describedby="language-identifier" onChange={this.searchWord} />
          </div>
        </div>
        <div className="col-12">
          <div className="list-group">
            {
              this.state.foundWords.map(
                word => (
                  <button key={ "open-word-modal-" + word.id } type="button"
                    className="list-group-item list-group-item-action"
                    data-toggle="modal" data-target={ "#word-modal-" + word.id }>
                      { word.get("word") }
                  </button>
                )
              )
            }
          </div>
        </div>
      </div>
    )
  }

  renderWordAddForm = () => {
    return (
      <div className="row my-4">
        <div className="col-12">
          <form onSubmit={this.addWord}>
            <div className="form-group">
              <label htmlFor="word">Слово</label>
              <DevanagariTextInput id="word" placeholder="हिंदी"
                required={true} setValue={
                  value => this.updateInput({target: {id: "word", value: value}}) 
                } />
            </div>
            <div className="form-group">
              <label htmlFor="transliteration">Транслитерация</label>
              <DevanagariTextInput id="transliteration" placeholder="hindi"
                required={true} setValue={
                  value => this.updateInput({ target: { id: "transliteration", value: value } })
                } />
            </div>
            <div className="form-group">
              <label htmlFor="spellings">Альтернативные написания</label>
              <DevanagariTextInput id="spellings" placeholder="हिंदी, हिन्दी"
                setValue={
                  value => this.updateInput({ target: { id: "spellings", value: value } })
                } />
            </div>
            <div className="form-group">
              <label htmlFor="part_of_speech">Часть речи</label>
              <select className="form-control" id="part_of_speech" onChange={this.updateInput}>
                {
                  Object.entries(this.getPartsOfSpeech()).map(
                    ([key, value]) => <option key={ key } value={ key }>{ value }</option>
                  )
                }
              </select>
            </div>
            <hr />
            <label htmlFor="properties">Свойства</label>
            {
              this.getPropertiesForPartOfSpeech(this.state.part_of_speech).map(
                prop => (
                  <div className="form-group" key={"prop-" + prop.name}>
                    <label htmlFor={prop.name}>
                      {prop.readableName}
                    </label>
                    <br />
                    <div className="form-check form-check-inline">
                      {
                        prop.values.map(
                          value => {
                            let valueId = "prop-" + prop.name + "-value-" + value.name;
                            return (
                              <React.Fragment key={valueId}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={valueId}
                                  value={value.name}
                                  onChange={
                                    event => this.updateProperty(prop.name, value.name, event.target.checked)
                                  } />
                                <label className="form-check-label pr-2" htmlFor={valueId}>{value.readableName}</label>
                              </React.Fragment>
                            )
                          }
                        )
                      }
                    </div>
                  </div>
                )
              )
            }
            <hr />
            <div className="form-group">
              <label>Значения</label>
              {
                this.state.meanings.map(
                  (value, index) => {
                    return (
                      <div className="input-group" key={"meaning-input-group-" + index}>
                        <textarea className="form-control" id={"meanings-" + index}
                          placeholder="хинди (язык)" rows="3" required={true}
                          value={value.meaning} onChange={event => this.updateMeaning(index, event.target.value)}>
                        </textarea>
                        <textarea className="form-control" id={"meanings_example" + index}
                          placeholder="हम हिंदी बोलते हैं। Мы говорим на хинди." rows="3"
                          value={value.examples} onChange={event => this.updateMeaningExamples(index, event.target.value)}>
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
            <div className="form-group">
              <label htmlFor="control_rus">Управление</label>
              <div className="input-group">
                <textarea className="form-control" id="control_rus"
                  rows="3" placeholder="на русском" required={true}
                  onChange={ this.updateInput }>
                </textarea>
                <textarea className="form-control" id="control_hin"
                  rows="3" placeholder="на хинди" onChange={ this.updateInput }>
                </textarea>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="stable_phrases_rus">Устойчивые словосочетания</label>
              <div className="input-group">
                <textarea className="form-control" id="stable_phrases_rus"
                  rows="3" placeholder="на русском" required={true}
                  onChange={this.updateInput}>
                </textarea>
                <textarea className="form-control" id="stable_phrases_hin"
                  rows="3" placeholder="на хинди" onChange={this.updateInput}>
                </textarea>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="examples_rus">Примеры</label>
              <div className="input-group">
                <textarea className="form-control" id="examples_rus"
                  rows="3" placeholder="на русском" required={true}
                  onChange={this.updateInput}>
                </textarea>
                <textarea className="form-control" id="examples_hin"
                  rows="3" placeholder="на хинди" onChange={this.updateInput}>
                </textarea>
              </div>
            </div>
            <div className="col-12 my-3 text-center">
              <button className={
                "btn btn-outline-primary"
                + (
                  (this.state.upload_status !== "not_started")
                    ? " disabled"
                    : ""
                )
              } type="submit">
                {
                  this.state.upload_status === "error"
                    ? "Что-то пошло не так. Нажмите F12, сделайте скриншот и покажите его Диме."
                    : "Отправить"
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.foundWords.map(
            word => (
              <div className="modal fade" id={ "word-modal-" + word.id }
                  tabindex="-1" aria-labelledby={ "word-modal-" + word.id + "-label"}
                  aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id={ "word-modal-" + word.id + "-label"}>
                        { word.get("word") }
                      </h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      { this.renderWord(word) }
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">
                        Закрыть
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )
        }
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <button className="btn nav-link" onClick={ () => this.routeTo("main-page") }>
                Главная
              </button>
            </li>
            <li className="nav-item">
              <button className="btn nav-link" onClick={() => this.routeTo("add-word") }>
                Предложить свое слово
              </button>
            </li>
            {
              this.state.userIsAdmin ? (
                <li className="nav-item">
                  <button className="btn nav-link" onClick={ () => this.routeTo("admin-panel") }>
                    Панель админа
                  </button>
                </li>
              ) : ""
            }
            <li className="nav-item">
              <button className="btn nav-link disabled">
                Контакты
              </button>
            </li>
            <li className="nav-item">
              <button className="btn nav-link disabled">
                О нас
              </button>
            </li>
          </ul>
          {
            this.state.user ? (
              <button className="btn btn-primary"
                  onClick={ this.signOut }>
                Выйти ({ this.state.user.displayName })
              </button>
            ) : (
              <button className="btn btn-primary" onClick={ this.signIn }>
                  Войти через Google
              </button>
            )
          }
        </nav>
        <div className="container">
          { this.getPage() }
        </div>
      </React.Fragment>
    );
  } 
}

export default App;
