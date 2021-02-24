import React, {Component} from 'react';
import './tile.css';

export default class Tile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            description: this.props.description,
            book: null
        }
    }

    componentDidMount(){
        return;
    }

    render(){
        return(
            <div className="tile">
                {this.state.name}
            </div>
        )
    }
}