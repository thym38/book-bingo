import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BookList from './components/BookList';
import Tile from './components/Tile';

import Modal from 'react-overlays/Modal';
import styled from 'styled-components';

import Flipcard from '@kennethormandy/react-flipcard'
import '@kennethormandy/react-flipcard/dist/Flipcard.css'

let headings = require('./headings.json');
let descriptions = require('./descriptions.json');
let hardmode = require('./hardmode.json');

// REFS:
// https://www.reddit.com/r/Fantasy/comments/ft254j/official_rfantasy_2020_book_bingo_challenge/
// https://docs.google.com/spreadsheets/d/1TE35C1uyGIxNmbT1VvKqHQK5viUMncII2r3kF9wnfhQ/edit#gid=1715401840
// https://github.com/kennethormandy/react-flipcard
// https://react-bootstrap.github.io/react-overlays/api/Modal
// https://www.npmjs.com/package/@welldone-software/why-did-you-render#tracking-components
// https://levelup.gitconnected.com/building-a-simple-dynamic-search-bar-in-react-js-f1659d64dfae
// https://github.com/amydegenaro/great-reads/blob/84b6bc48fa712e8562a60f7327ca5a6e48fc03bc/client/store/index.js#L59


const SearchBox = styled(Modal)`
  position: fixed;
  width: 50%;
  z-index: 1040;
  top: 15%;
  left: 25%;
  max-height: 70%;
  overflow: scroll;
  border: 1px solid #e5e5e5;
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  padding: 0 40px 20px 40px;
  @media (max-width: 768px) {
    width: 80%;
    top: 5%;
    left: 10%;
    padding: 0 40px 20px 40px;
    max-height: 90%;
    overflow: scroll;
  }
`;

const Backdrop = styled("div")`
  position: fixed;
  z-index: 1040;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000;
  opacity: 0.5;
`;


export default class App extends Component  {
  static whyDidYouRender = true
  constructor() {
    super()

    this.state = {
      flipped: Array(25).fill(false), // initialise 5x5 1D array of zeroes
      search: "",
      show: false,
      images: Array(25).fill(''),
      buttonClicked: false,
      currentCard: 0,
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (this.props.search !== nextProps.search) {
      return true
    }
    if (this.props.flipped !== nextProps.flipped) {
      return true
    }
    if (this.state.search !== nextState.search) {
      return true
    }
    if (this.state.flipped !== nextState.flipped) {
      return true
    }
    if (this.state.show !== nextState.show) {
      return true
    }
    if (this.state.images !== nextState.images) {
      return true
    }
    if (this.state.buttonClicked !== nextState.buttonClicked) {
      return true
    }
    return false;
  }

  flipper(index) {
    if (this.checkIfBookAdded(index)) {
      let old = this.state.flipped;
      let newFlipped = old.slice(0,index).concat([!this.state.flipped[index]]).concat(old.slice(index+1));
      this.setState({flipped: newFlipped});
    }
  }

  checkIfBookAdded(index){
    if (this.state.images[index] !== ''){
      return true;
    } else {
      return false;
    }
  }

  addBook(index) {
    this.setState({show: true, currentCard: index})
  }

  editSearchTerm(e) {
    this.setState({search: e.target.value});
  }

  handleButtonClick() {
    this.setState({buttonClicked: !(this.state.buttonClicked)})
  }

  handleBookSelect(index, link) {
    let old = this.state.images;
    let newImages= old.slice(0,index).concat([link]).concat(old.slice(index+1));

    // make front of card (description) the back after a book cover is added
    if (!this.checkIfBookAdded(index)){
      let oldFlip = this.state.flipped;
      let newFlipped = oldFlip.slice(0,index).concat([!this.state.flipped[index]]).concat(oldFlip.slice(index+1));
    
      this.setState({images: newImages, show: false, flipped: newFlipped})
    }

    this.setState({images: newImages, show: false})
  }

  render () {
    return (
      <div className="App">
        <header className="App-header">
          
          <div className={'grid-container'}>
            { headings.map(book => {
              let key = parseInt(book.slice(0,2))-1;
              return <Flipcard 
                        key={key} 
                        className={'item'} 
                        onMouseEnter={e=>this.flipper(key)} 
                        onMouseLeave={e=>this.flipper(key)} 
                        onClick={e=>this.addBook(key)} 
                        flipped={this.state.flipped[key]}>
                  <div className={'flipcard'}><span className={"description"}>{book.slice(2)}</span></div>
                  <div className={'flipcard'}>
                    {this.state.images[key] !== '' ? <img className={"covers"} src={this.state.images[key]}/> : ''}
                  </div>
                </Flipcard>
            })}
          </div>

          {/* <BookList/> */}

          <SearchBox
            show={this.state.show}
            onHide={() => this.setState({show: false})}
            aria-labelledby="modal-label"
            renderBackdrop={e=><Backdrop {...e}/>}
          >
            <div>
            <br /><h4>{headings[this.state.currentCard].slice(2)}</h4>
              <br /><span>{descriptions[this.state.currentCard]}</span>
              <br /><span>HARD MODE: {hardmode[this.state.currentCard]}</span>

              <br />
              <Form>
                <Form.Group style={{'display':'inline-block', 'marginRight': '10px'}} controlId="formSearchTitle">
                  <Form.Control size="lg" type="text" placeholder="Search by title..." onChange={this.editSearchTerm.bind(this)}/>
                </Form.Group>
                <Button size="lg" className={'goButton'} onClick={e=> this.handleButtonClick()}>
                  Go
                </Button>
              </Form>

              <BookList search={this.state.search} buttonClicked={this.state.buttonClicked} currentCard={this.state.currentCard} handleBookSelect={this.handleBookSelect.bind(this)}/>
            </div>

          </SearchBox>

        </header>
      </div>
    );
  }
}
