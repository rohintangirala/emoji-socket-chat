import React, { Component } from 'react';
import io from 'socket.io-client';
import _ from 'lodash';
import { Container, Jumbotron, Dropdown, Row, Col} from 'react-bootstrap';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      message: '',
      messages: []
    };

    this.socket = io('https://emoji-chat-server-rtangirala.herokuapp.com');

    this.socket.on('RECEIVE_MESSAGE', data => {
      this.addMessage(data);
      this.emojify(data.author, data.message);
    });

    let emoticon = require('emoticon');

    this.emoticons = [];

    _.map(emoticon, entry => {
      _.map(entry.emoticons, emoticon_pattern => {
        this.emoticons.push(emoticon_pattern);
        
        return null;
      });
      
      return null;
    });

    this.addMessage = data => {
      if (data.author === '') {
        data.author = 'Anonymous';
      }
      
      this.setState({ messages: [...this.state.messages, this.emojify(data.author, data.message)] });
    };

    this.handleUsernameChange = event => {
      this.setState({ username: event.target.value });
    };

    this.handleMessageChange = event => {
      this.setState({ message: event.target.value });
    };

    this.sendMessage = event => {
      event.preventDefault();
      
      this.socket.emit('SEND_MESSAGE', {
        author: this.state.username,
        message: this.state.message
      });

      this.setState({ message: '' });
    };

    this.insertEmoticon = emoticon => {
      let currentMessage = this.state.message;

      if (currentMessage.length > 0 && currentMessage[currentMessage.length - 1] !== ' ') {
        this.setState({ message: currentMessage.concat(' ' + emoticon + ' ') });
      } else {
        this.setState({ message: currentMessage.concat(emoticon + ' ') });
      }
    }

    this.emojify = (author, message) => {
      let emoticon = require('emoticon');
      let emojifiedMessage = message;

      _.map(emoticon, entry => {
        _.map(entry.emoticons, emoticon_pattern => {
          let words = _.split(emojifiedMessage, ' ');

          if (words.includes(emoticon_pattern)) {
            emojifiedMessage = _.replace(emojifiedMessage, emoticon_pattern, entry.emoji);
          }          
          
          return null;
        });

        return null;
      });
      
      let emojifiedData = {
        author: author,
        message: emojifiedMessage
      };

      return emojifiedData;
    }
  }

  render() {
    return (
      <Container id="chat-container">
        <Jumbotron>
          <h1>Emoji Chat <span role="img" aria-label="smile">😄</span></h1>
          <br></br>
          <form onSubmit={this.sendMessage}>
            <label>Username:</label>
            <input type="text" placeholder="e.g. John Doe" value={this.state.username} onChange={this.handleUsernameChange} className="form-control"/>
            <br/>
            <label>Message:</label>
            <Row>
              <Col md={10} className="form-group">
                <input type="text" placeholder="e.g. Welcome to Emoji Chat :)" className="form-control" value={this.state.message} onChange={this.handleMessageChange}/>
              </Col>
              <Col md={2}>
              <Dropdown className="form-group">
                <Dropdown.Toggle block>
                  Emoticons
                </Dropdown.Toggle>
                <Dropdown.Menu className="scrollable-menu">
                  {
                    _.map(this.emoticons, emoticon_pattern => {
                      return (
                        <Dropdown.Item onClick={() => this.insertEmoticon(emoticon_pattern) } key={emoticon_pattern}>{emoticon_pattern}</Dropdown.Item>
                      );
                    })
                  }
                </Dropdown.Menu>
              </Dropdown>
              </Col>
            </Row>
            <br/>
            <input type="submit" className="btn btn-primary form-control" value="Send"></input>
          </form>
          <br></br>
          <div>
            {
              _.map(this.state.messages, message => {
                return (
                  <div><strong>{message.author}:</strong> {message.message}</div>
                );
              })
            }
          </div>
        </Jumbotron>
        <p id="author">Built by <a href="https://github.com/rohintangirala">@rohintangirala</a></p>
      </Container>
    );
  }
}

export default App;
