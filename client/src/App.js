import React, { Component } from 'react';
import io from 'socket.io-client';
import _ from 'lodash';
import { Container, Row, Col, Card} from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      message: '',
      messages: []
    };

    this.socket = io('localhost:5000');

    this.socket.on('RECEIVE_MESSAGE', data => {
      addMessage(data);
      emojify(data.author, data.message);
    });

    const addMessage = data => {
      this.setState({ messages: [...this.state.messages, emojify(data.author, data.message)] });
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      this.socket.emit('SEND_MESSAGE', {
        author: this.state.username,
        message: this.state.message
      })
      this.setState({ message: '' });
    };

    const emojify = (author, message) => {
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
      }
      return emojifiedData;
    }
  }

  render() {
    return (
      <Container id="chat-card">
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Emoji Chat <span role="img" aria-label="smile">😄</span></Card.Title>
                <hr/>
                <div className="messages">
                  {
                    this.state.messages.map(message => {
                      return (
                        <div><strong>{message.author}:</strong> {message.message}</div>
                      );
                    })
                  }
                </div>
              </Card.Body>
              <Card.Footer>
                <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} className="form-control"/>
                <br/>
                <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})}/>
                <br/>
                <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
