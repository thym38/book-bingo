import React, {Component} from 'react';
import axios from 'axios';

import './BookList.css';

// REFS:
// https://openlibrary.org/dev/docs/api/search
// https://github.com/axios/axios

export default class BookList extends Component {
  static whyDidYouRender = true
    constructor(props) {
        super(props);
        this.state = {
            url: "https://openlibrary.org/search.json?title=$",
            // url: "http://openlibrary.org/api/search?q=",
            books: [],
            search: this.props.search, 
            buttonClicked: this.props.buttonClicked,
            currentCard: this.props.currentCard,
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (this.props.search !== nextProps.search) {
      return true
    }
    if (this.props.buttonClicked !== nextProps.buttonClicked) {
      return true
    }
    if (this.props.books !== nextProps.books) {
      return true
    }
    if (this.state.books !== nextState.books) {
      return true
    }
    if (this.state.search !== nextState.search) {
      return true
    }
    if (this.state.buttonClicked !== nextState.buttonClicked) {
      return true
    }
    if (this.state.currentCard !== nextState.currentCard) {
      return true
    }
    return false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (prevProps.search !== this.props.search) {
        this.setState({search: this.props.search});
        // this.fetchBooks();
      }
      if (prevProps.buttonClicked !== this.props.buttonClicked) {
        this.setState({buttonClicked: this.props.buttonClicked});
        this.fetchBooks();
      }
      if (prevProps.currentCard !== this.props.currentCard) {
        this.setState({currentCard: this.props.currentCard});
      }
    }

    fetchBooks() {
      axios.get(this.state.url.concat(this.state.search.replace(" ", "+").concat("&limit=30")))
          .then(res => {
            const books = res.data.docs;
            this.setState({ books: books });
            console.log("received");
            console.log(res);
          })
    }
    
    render() {
      return (
        <div className={'scrollTime2'}>
        {this.state.books.slice(0,10).map(
            book => {
              if (book.isbn) {
                const cover = "https://covers.openlibrary.org/b/isbn/".concat(book.isbn[0], "-L.jpg");
                return <div key={book.isbn[0]} className={'menu_item'} onClick={e => this.props.handleBookSelect(this.state.currentCard, cover)}>
                  <span>{book.title}</span>
                  <br/>
                  <span>{book.author_name?book.author_name.map(name => name.concat(", ")):''}</span>
                  <img src={cover} style={{'height':'50px'}}/>
                  {/* {book} */}
                </div>
              }
            }
            )}
        </div>
    
      )
    }
  }