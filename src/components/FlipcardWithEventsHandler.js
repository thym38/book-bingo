import React, { useState, useEffect } from "react";
import '../App.css';

import Flipcard from '@kennethormandy/react-flipcard'
import '@kennethormandy/react-flipcard/dist/Flipcard.css'

const FlipcardWithEventsHander = ({events, key, flipped, book, image}) => {
    const[ourProps, setOurProps] = useState([]);

    useEffect(() => {
        setOurProps([{events, key, flipped, book, image}]);
    }, [events, key, flipped, book, image]);

    return (

    <Flipcard 
        className={'item'} 
        key={key}
        // onTouchStart={e=>this.tap()}
        // onTouchEnd={e=>this.handleTouchscreen(e,key)}

        // onMouseEnter={e=>this.flipper(key)} 
        // onPointerLeave={e=>this.flipper(key)} 
        // onMouseLeave={e=>this.non_chrome_flipper(key)} 

        // onMouseDown={e=>this.addBook(e, key)}
        {...events}
        flipped={flipped}
        >
            <div className={'flipcard'}>
                <span className={"description"}>
                    {book}
                </span>
            </div>
            <div className={'flipcard'}>
                {image !== '' ? <img className={"covers"} src={image}/> : ''}
            </div>
        </Flipcard>
)};

export default FlipcardWithEventsHander;