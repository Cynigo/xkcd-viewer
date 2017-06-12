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
      comic: {
        num: 0,
      },
      preload: {},
    };
  }

  componentWillMount() {
    this.switchXKCD(+window.location.pathname.match(/([^/]*)$/)[0]);

    document.addEventListener('keydown', this.keyPress.bind(this));
    
    // Listen to forward/backward history change
    this.unlisten = history.listen(loc => {
      this.setState(loc.state);
      this.preload();
    });
  }

  // Preload comics the user might visit
  async preload() {
    const before = String(this.state.comic.num - 1);
    const after = String(this.state.comic.num + 1);

    if (!(before in this.state.preload)) {
      this.getXKCD(before);
    }

    if (!(after in this.state.preload)) {
      this.getXKCD(after);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPress.bind(this));
    this.unlisten();
  }

  getXKCD(id = null) {
    if (+id < 1) return Promise.resolve(null);

    return fetchJsonp(API_URL(id))
    .then(res => res.json())
    .then(res => {
      if (!res || !Object.keys(res).length) return null;
      
      // Cache the comic
      const state = this.state;

      state.preload[String(res.num)] = res;
      this.setState(state);
      return res;
    });
  }

  async switchXKCD(go) {
    const id = go ? this.state.comic.num + go : null;
    const preloadComic = this.state.preload[id];

    const comicData = preloadComic || await this.getXKCD(String(id));

    if (!comicData || !Object.keys(comicData).length) return;

    const state = this.state;
    state.comic = comicData;

    history[go ? 'push' : 'replace'](String(comicData.num), state);
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
          src={this.state.comic.img}
          alt={this.state.comic.alt}
        />
      </div>
    );
  }
}

export default App;
