import React, {Component} from 'react';
import logo from './logo.png';
import './App.css';
import BookList from './components/BookList';
import Tile from './components/Tile';

import Flipcard from '@kennethormandy/react-flipcard'
// Import minimal required styles however you’d like
import '@kennethormandy/react-flipcard/dist/Flipcard.css'

let headings = require('./headings.json');

// REFS:
// https://www.reddit.com/r/Fantasy/comments/ft254j/official_rfantasy_2020_book_bingo_challenge/
// https://docs.google.com/spreadsheets/d/1TE35C1uyGIxNmbT1VvKqHQK5viUMncII2r3kF9wnfhQ/edit#gid=1715401840
// https://github.com/kennethormandy/react-flipcard

export default class App extends Component  {
  constructor() {
    super()

    this.state = {
      flipped: Array(25).fill(false), // initialise 5x5 1D array of zeroes
    }
  }

  flipper(index){
    let old = this.state.flipped;
    let newFlipped = old.slice(0,index).concat([!old[index]]).concat(old.slice(index+1));
    this.setState({flipped: newFlipped});
  }

  render () {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          
          <div className={'grid-container'}>
            { headings.map(book => {
              let key = parseInt(book.slice(0,2))-1;
              return <Flipcard key={key} className={'item'} onClick={e=>this.flipper(key)} flipped={this.state.flipped[key]}>
                <div className={'card'}>{book.slice(2)}</div>
                <div className={'card'}>Two</div>
                </Flipcard>
            })}
          </div>

          {/* <BookList/> */}

        </header>
      </div>
    );
  }
}
