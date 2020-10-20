import React from 'react';
import './App.css';

function App() {
  return (
    <div className="container">
      <div className="row py-5">
        <h2 className="mx-auto text-center">
          Добро пожаловать на сайт хинди-русского онлайн-словаря!
        </h2>
      </div>
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
    </div>
  );
}

export default App;
