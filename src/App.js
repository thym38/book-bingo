import React, {Component} from 'react';
import { instanceOf } from 'prop-types';

import { withCookies, Cookies } from 'react-cookie';
import CookieConsent from "react-cookie-consent";
import { PDFDownloadLink } from '@react-pdf/renderer';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

import Modal from 'react-overlays/Modal';
import styled from 'styled-components';

import './App.css';
import BookList from './components/BookList';
import MyDocument from './components/Document';
import EventHandler from './components/EventsHandler';
import FlipcardWithEventsHandler from './components/FlipcardWithEventsHandler';

let headings = require('./resources/headings.json');
let descriptions = require('./resources/descriptions.json');
let hardmode = require('./resources/hardmode.json');
let info_text = require('./resources/info_text.json');

// REFS:
// https://www.reddit.com/r/Fantasy/comments/ft254j/official_rfantasy_2020_book_bingo_challenge/
// https://docs.google.com/spreadsheets/d/1TE35C1uyGIxNmbT1VvKqHQK5viUMncII2r3kF9wnfhQ/edit#gid=1715401840
// https://github.com/kennethormandy/react-flipcard
// https://react-bootstrap.github.io/react-overlays/api/Modal
// https://www.npmjs.com/package/@welldone-software/why-did-you-render#tracking-components
// https://levelup.gitconnected.com/building-a-simple-dynamic-search-bar-in-react-js-f1659d64dfae
// https://github.com/amydegenaro/great-reads/blob/84b6bc48fa712e8562a60f7327ca5a6e48fc03bc/client/store/index.js#L59
// https://www.npmjs.com/package/react-cookie

// HEROKU: https://github.com/mars/create-react-app-buildpack#usage

const isChrome = !!window.chrome;

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


const InfoBox = styled(Modal)`
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


class App extends Component  {

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    const { cookies } = props;

    this.state = {
      // use cookies to store book cover images
      images: cookies.get('images') || Array(25).fill(''),
      authors: cookies.get('authors') || Array(25).fill(''),
      titles: cookies.get('titles') || Array(25).fill(''),

      // flipped: Array(25).fill(false), // initialise 5x5 1D array of zeroes
      flipped: cookies.get('images') ? cookies.get('images').map(e=>e===''?false:true) : Array(25).fill(false),
      search: "",
      show: false,
      show_info: false,
      show_help: false,
      
      buttonClicked: false,
      currentCard: 0,
      touch: null,
      clicked: false,
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
    if (this.state.show_info !== nextState.show_info) {
      return true
    }
    if (this.state.show_help !== nextState.show_help) {
      return true
    }
    if (this.state.images !== nextState.images) {
      return true
    }
    if (this.state.authors !== nextState.authors) {
      return true
    }
    if (this.state.titles !== nextState.titles) {
      return true
    }
    if (this.state.buttonClicked !== nextState.buttonClicked) {
      return true
    }
    if (this.state.touch !== nextState.touch) {
      return true
    }
    if (this.state.clicked !== nextState.clicked) {
      return true
    }
    return false;
  }

  flipper(index) {
    // only flip on mouseover if a book cover has been added
    if (this.checkIfBookAdded(index)) {
      let old = this.state.flipped;
      let newFlipped = old.slice(0,index).concat([!this.state.flipped[index]]).concat(old.slice(index+1));
      this.setState({flipped: newFlipped});
    }
  }

  non_chrome_flipper(index){
    if (!isChrome){
      this.flipper(index);
    }
  }

  checkIfBookAdded(index){
    if (this.state.images[index] !== ''){
      return true;
    } else {
      return false;
    }
  }

  eventsHandler(eventType, index) {

    if (eventType === 'touchend_short') {
      this.addBook(index);
    }
    if (eventType === 'touchend_long') {
      this.flipper(index);
    }
    if (eventType === 'mouseenter' || eventType === 'pointerleave') {
      this.flipper(index);
    }
    if (eventType === 'mouseleave' & (!isChrome)) {
      this.flipper(index);
    }
    if (eventType === 'mousedown') {
      this.addBook(index);
    }
  }

  addBook(index) {
    this.setState({show: true, currentCard: index})
  }

  tap() {
    this.setState({touch: Date.now()});
  }

  handleTouchscreen(e, index) {
    e.stopPropagation();
    e.preventDefault();
    if ((Date.now()-this.state.touch) > 150) {
      this.flipper(index);
    } else {
      this.addBook(index);
    }
  }

  editSearchTerm(e) {
    this.setState({search: e.target.value});
  }

  handleButtonClick() {
    this.setState({buttonClicked: !(this.state.buttonClicked)})
  }

  handleBookSelect(index, cover_link, author, title) {
    const { cookies } = this.props;

    let old = this.state.images;
    let newImages = old.slice(0,index).concat([cover_link]).concat(old.slice(index+1));

    old = this.state.authors;
    let newAuthors = old.slice(0,index).concat([author]).concat(old.slice(index+1));

    old = this.state.titles;
    let newTitles = old.slice(0,index).concat([title]).concat(old.slice(index+1));

    cookies.set('images', newImages, { path: '/' });
    cookies.set('authors', newAuthors, { path: '/' });
    cookies.set('titles', newTitles, { path: '/' });

    // make front of card (description) the back after a book cover is added
    if (!this.checkIfBookAdded(index)){
      let oldFlip = this.state.flipped;
      let newFlipped = oldFlip.slice(0,index).concat([!this.state.flipped[index]]).concat(oldFlip.slice(index+1));
    
      this.setState({flipped: newFlipped})
    }

    this.setState({images: newImages, authors: newAuthors, titles: newTitles, show: false})
  }

  render () {
    return (
      <div className="App">
        <header className="App-header">
          
          <div className={'grid-container'}>
            { headings.map(book => {
              let key = parseInt(book.slice(0,2))-1;
              return <EventHandler handleAction={e=>this.eventsHandler(e, key)}>
                {(events) => (<FlipcardWithEventsHandler 
                                      events={events} 
                                      key={key} 
                                      flipped={this.state.flipped[key]} 
                                      book={book.slice(2)} 
                                      image={this.state.images[key]} >
                              </FlipcardWithEventsHandler>)}
                </EventHandler>})}
          </div>

          <SearchBox
            key={'search'}
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

          <InfoBox
              key={'info'}
              show={this.state.show_info}
              onHide={() => this.setState({show_info: false})}
              aria-labelledby="modal-label"
              renderBackdrop={e=><Backdrop {...e}/>}
          >
            <div>
              <p></p>
              <h2>Bingo Rules</h2>
              {info_text.map(line => {return (<p>{line}</p>)})}
              <span className={'line'}>Visit the </span>
              <a className={'line'} href="https://www.reddit.com/r/Fantasy/comments/ttrev1/official_rfantasy_2022_book_bingo_challenge/" target="_blank">r/fantasy</a>
              <span className={'line'}> challenge page for more information.</span> <br/><br/>
            </div>
          </InfoBox>

          <InfoBox
              show={this.state.show_help}
              onHide={() => this.setState({show_help: false})}
              aria-labelledby="modal-label"
              renderBackdrop={e=><Backdrop {...e}/>}
          >
            <div>
              <p></p><br/>
              <span>This webapp uses cookies to record your selected challenge books.  You can change or add a new book by tapping a challenge card and searching for the book title.  If you're browsing on a mobile device, tap and hold a book cover card to flip it back over.</span> <br/>
              <span>Can't find the book you're looking for? </span> <br/>
              <span className={'line'}>Create an Open Library account and </span>
              <a className={'line'} href='https://openlibrary.org/books/add'>add</a>
              <span className={'line'}> it to their database. Open Library is a non-profit virtual library empowering universal access to all knowledge.</span> <br/><br/>
              
              <span className={'line'}>This React Webapp was created by Emma Herbold (2021).&emsp;</span><br/>
              <a className={'line'} href="mailto:emmaherbold@mail.com">Contact</a>
              <p className={'line'}>&emsp;</p>
              <a className={'line'} href="https://github.com/thym38/book-bingo" target="_blank">GitHub</a> <br/><br/>
              <p className={'line'}>Book information courtesy of </p>
              <a className={'line'} href='https://openlibrary.org/'>https://openlibrary.org/</a><br/>
              
              <span>Not sponsored, they just strive for a great cause ;)</span>
            </div>
          </InfoBox>

          {/* https://iconmonstr.com/download-17-svg/ */}
          <PDFDownloadLink document={<MyDocument clicked={this.state.clicked} images={this.state.images} authors={this.state.authors} titles={this.state.titles}/>} fileName="BingoCard.pdf">
            {({ blob, url, loading, error }) =>
              loading ? 'Loading document...' : <img className="download" title="Download as a PDF" alt="Download as a PDF" src="iconmonstr-download-17.svg" onClick={e=> this.setState({clicked:true})}/>
            }
          </PDFDownloadLink>

          {/* https://iconmonstr.com/help-3-svg/ */}
          <img className="help" title="About" src="iconmonstr-help-3.svg" alt="About" onClick={e=> this.setState({show_help:true})}/>
          
          {/* https://iconmonstr.com/info-6-svg/ */}
          <img className="info" title="Challenge Info" src="iconmonstr-info-6.svg" alt="Challenge Info" onClick={e=> this.setState({show_info:true})}/>


          <CookieConsent
            location="bottom"
            buttonText="Accept"
            cookieName="cookieConsent"
            style={{ color: "#7db58e", fontWeight: "bold", background: "#F1F8F1" }}
            buttonStyle={{ color: "#F1F8F1", fontWeight: "bold", background: "#7db58e", fontSize: "16px"}}
            expires={150}
            // debug={true}
          >
            This website uses cookies to remember your read books.
          </CookieConsent>

        </header>
      </div>
    );
  }
}

export default withCookies(App);