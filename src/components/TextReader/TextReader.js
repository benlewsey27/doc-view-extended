import React from 'react';
import PropTypes from 'prop-types';
import './TextReader.css'

/**
 * React Stateless Functional Component. Renders an element to display a
 * text document's title and content.
 * 
 * @param {Object} props - The React props passed down from the parent 
 * component
 */
export const TextReader = (props) => {
    // Check if docs object has been initialised
    if (props.docs !== undefined) {
        return (
            <div className='text-reader'>
                <h5>{props.activeDoc}</h5>
                <br />
                {props.docs[props.activeDoc]}
            </div>
        )
    }

    return <p>No text to show, waiting for files to load...</p>
}

// React PropTypes object
TextReader.propTypes = {
    docs: PropTypes.object,
    activeDoc: PropTypes.string
}