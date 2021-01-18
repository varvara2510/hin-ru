import React from 'react';
import firebase from 'firebase';
import Database from './db';
import {
  getPartsOfSpeech,
  getPropertiesForPartOfSpeech
} from './utils';
import './App.css';
import MainPage from './components/MainPage';
import WordAddWorm from './components/WordAddForm';

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
      foundWords: [],
      user: undefined,
      userIsAdmin: false
    }
  )

  resetState = () => this.setState(
    {
      ...this.getCleanState(),
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

  searchWord = event => {
    this.database.searchWords(event.target.value).get().then(
      snapshot => {
        this.setState({
          foundWords: snapshot.docs,
        })
      }
    )
  }

  getPage = () => {
    switch (this.state.currentRoute) {
      case "main-page":
        return <MainPage foundWords={this.state.foundWords} searchWord={this.searchWord} />;
      case "add-word":
        return <WordAddWorm user={this.state.user} />;
      case "admin-panel":
        return "ADMIN PANEL UNDER CONSTRUCTION";
      default:
        return <MainPage foundWords={this.state.foundWords} />;
    }
  }

  renderWord = word => {
    return (
      <table className="table">
        <tbody>
          <tr>
            <th>Часть речи</th>
            <td>
              { getPartsOfSpeech()[word.get("part_of_speech")] }
            </td>
          </tr>
          {
            getPropertiesForPartOfSpeech(word.get("part_of_speech")).map(
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
            <td>{word.get("control")["rus"]}</td>
            <td>{word.get("control")["hin"]}</td>
          </tr>
          <tr>
            <th>Устойчивые словосочетания</th>
            <td>{word.get("stable_phrases")["rus"]}</td>
            <td>{word.get("stable_phrases")["hin"]}</td>
          </tr>
          <tr>
            <th>Примеры</th>
            <td>{word.get("examples")["rus"]}</td>
            <td>{word.get("examples")["hin"]}</td>
          </tr>
          <tr>
            <th>Значения</th>
            <td>
              <table className="table">
                <tbody>
                  {
                    word.get("meanings").map(
                      meaning => (
                        <tr key={meaning.meaning}>
                          <td>{meaning.meaning}</td>
                          <td>{meaning.examples}</td>
                        </tr>
                      )
                    )
                  }
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.foundWords.map(
            word => (
              <div className="modal fade" id={ "word-modal-" + word.id }
                  tabIndex="-1" aria-labelledby={ "word-modal-" + word.id + "-label"}
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
