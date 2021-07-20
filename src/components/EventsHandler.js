// CUSTOMER MOUSE / TOUCH EVENTS HANDLER
// based on react-touch-mouse-handler by seleckis
// https://github.com/seleckis/react-touch-mouse-handler/blob/master/src/index.js

import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class EventsHandler extends Component {
    static propTypes = {
        children: PropTypes.func.isRequired,
        handleAction: PropTypes.func,
    }
    constructor(props) {
        super(props);
        this.state = {
            isTouchStarted: false,
            time: null
        };
    }
    onEvent = (e) => {
        const {isTouchStarted, time} = this.state;
        const {handleAction} = this.props;
        let eventType = '';

        if (!isTouchStarted) {
            if (e.type === 'touchstart') {
                eventType = 'touchstart';
                this.setState({
                    isTouchStarted: true, 
                    time: Date.now()
                });
            } else if (e.type === 'mouseenter') {
                eventType = 'mouseenter';
                this.setState({
                    mouseEnter: true
                });
            } else if (e.type === 'mouseleave') {
                eventType = 'mouseleave';
            } else if (e.type === 'pointerleave') {
                eventType = 'pointerleave';
            } else if (e.type === 'mousedown') {
                eventType = 'mousedown';
            }
        } else {
            e.preventDefault();
        };

        // disable pointerleave on touchscreen
        if (e.type === 'pointerleave') {
            e.preventDefault();
        }

        if (e.type === 'touchend') {
            // eventType = 'touchend';

            if ((Date.now()-time) > 150) {
                eventType = 'touchend_long';
            } else {
                eventType = 'touchend_short';
            }
            
            this.setState({
                isTouchStarted: false
            });
        } 

        handleAction(eventType);
    }
    render() {
        const {children} = this.props;

        return children({
            onTouchStart: this.onEvent,
			onTouchEnd: this.onEvent,
			onMouseEnter: this.onEvent, 
            onMouseLeave: this.onEvent, 
            onMouseDown: this.onEvent,
            onPointerLeave: this.onEvent,
        });
    }
}