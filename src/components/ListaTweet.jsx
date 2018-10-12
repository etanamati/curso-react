import {ListGroup} from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import Tweet from './Tweet';

const ListaTweet = props => {
    return (
        <ListGroup style={{flexBasis: '100%', marginTop: 10}} >
            {props.tweets.map(tweet => (
                <Tweet key={tweet.data ? tweet.data().uid : tweet.uid} 
                tweet={tweet.data ? tweet.data() : tweet}/>
            ))}
        </ListGroup>
    );
};

ListaTweet.propTypes = {
    tweets: PropTypes.array
};

export default ListaTweet;