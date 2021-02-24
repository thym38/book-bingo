import React, {Component} from 'react';
import axios from 'axios';

// REFS:
// https://openlibrary.org/dev/docs/api/search
// https://github.com/axios/axios

export default class BookList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "http://openlibrary.org/search.json?q=",
            books: []
        }
    }

    componentDidMount() {
      axios.get(this.state.url.concat("the+lord+of+the+rings"))
        .then(res => {
          const books = res.data.docs;
          console.log(res);
          this.setState({ books: books });
        })
    }
  
    render() {
      return (
        <ul>
          { this.state.books.slice(1,5).map(book => <li>{book.title}</li>)}
        </ul>
      )
    }
  }