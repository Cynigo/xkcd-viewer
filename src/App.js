import React, { Component } from 'react';
import createHistory from 'history/createBrowserHistory';
import fetchJsonp from 'fetch-jsonp';

import Image from './Components/Image';
import NavBlock from './Components/NavBlock';
import LastComicNotice from './Components/LastComicNotice';

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
      lastVisitComicID: null,
    };
  }

  componentWillMount() {
    this.switchXKCD(+window.location.pathname.match(/([^/]*)$/)[0]);

    document.addEventListener('keydown', this.keyPress.bind(this));
    const lastComicID = window.localStorage.getItem('lastComicID');

    if (lastComicID) {
      // Spread operators would be cool..
      const state = this.state;
      state.lastVisitComicID = lastComicID;
      this.setState(state);
    }
    
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

      // Delete from cache after 5 minutes
      setTimeout(() => {
        const futureState = this.state;

        delete futureState.preload[String(res.num)];
        this.setState(futureState);
      }, 3 * 60 * 1000);
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
    window.localStorage.setItem('lastComicID', String(comicData.num));
  }

  keyPress({ key }) {
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      this.switchXKCD(key === 'ArrowLeft' ? -1 : 1);
    }
  }

  goToLastVisitedComic() {
    const goto = Math.abs(+this.state.lastVisitComicID - this.state.comic.num);
    this.switchXKCD(this.state.comic.num > this.state.lastVisitComicID ? -goto : goto);

    const state = this.state;
    state.lastVisitComicID = null;
    this.setState(state);
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

        <LastComicNotice
          currentComicID={this.state.comic.num}
          lastVisitComicID={this.state.lastVisitComicID}
          onClick={this.goToLastVisitedComic.bind(this)}
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
