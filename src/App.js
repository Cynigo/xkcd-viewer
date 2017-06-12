import React, { Component } from 'react';
import createHistory from 'history/createBrowserHistory';
import fetchJsonp from 'fetch-jsonp';

import Image from './Components/Image';
import NavBlock from './Components/NavBlock';

import './App.css';

const API_URL = (id) => `https://dynamic.xkcd.com/api-0/jsonp/comic/${id || ''}`;

const history = createHistory();

class App extends Component {

  constructor() {
    super();
    this.state = {
      num: 0,
    };
  }

  componentWillMount() {
    this.switchXKCD(+history.location.pathname.substring(1));

    document.addEventListener('keydown', this.keyPress.bind(this));
    
    // Listen to forward/backward history change
    this.unlisten = history.listen(location => {
      this.setState(location.state);
    });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPress.bind(this));
    this.unlisten();
  }

  getXKCD(id = null) {
    return fetchJsonp(API_URL(id))
    .then(res => res.json());
  }

  async switchXKCD(go) {
    const id = go ? String(this.state.num + go) : null;
    const comicData = await this.getXKCD(id);

    if (!Object.keys(comicData).length) return;

    history[go ? 'push' : 'replace'](String(comicData.num), comicData);
    document.title = comicData.title;
  }

  keyPress({ key }) {
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      this.switchXKCD(key === 'ArrowLeft' ? -1 : 1);
    }
  }

  render() {
    return (
      <div 
        id="App"
      >
        <NavBlock
          id="left"
          onClick={() => this.switchXKCD(-1)}
        />
        <NavBlock
          id="right"
          onClick={() => this.switchXKCD(1)}
        />
        <Image
          src={this.state.img}
          alt={this.state.alt}
        />
      </div>
    );
  }
}

export default App;
