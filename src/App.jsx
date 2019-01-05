import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './App.css';
import logo from './logo.svg';
import Back from './back.png';
import GreyProfile from './grey_profile.png';

const ITEMS_URL = 'http://192.168.0.101:4567/items.json';

const Profile = () => (
  <div>
    <nav className="navbar navbar-light bg-light">
      <span className="navbar-brand mb-0 h1">
        <Link to="/">
          <img src={Back} alt="back" style={{ height: 30 }} />
        </Link>
        Profile
      </span>
    </nav>

    <div style={{ textAlign: 'center' }}>
      <img
        src={GreyProfile}
        alt="profile"
        style={{ height: 200, marginTop: 50 }}
      />
      <p style={{ color: '#888', fontSize: 20 }}>username</p>
    </div>
  </div>
);

class List extends Component {
  state = {
    items: [],
    loading: true,
    todoItem: '',
    offline: !navigator.onLine
  };

  componentDidMount() {
    fetch(ITEMS_URL)
      .then((response) => response.json())
      .then((items) => {
        this.setState({ items, loading: false });
      });

    window.addEventListener('online', this.setOfflineStatus);
    window.addEventListener('offline', this.setOfflineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.setOfflineStatus);
    window.removeEventListener('offline', this.setOfflineStatus);
  }

  setOfflineStatus = () => {
    this.setState({ offline: !navigator.onLine });
  };

  addItem = (e) => {
    e.preventDefault();

    fetch(ITEMS_URL, {
      method: 'POST',
      body: JSON.stringify({ item: this.state.todoItem }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((items) => {
        if (items.error) {
          alert(items.error);
        } else {
          this.setState({ items });
        }
      });

    this.setState({ todoItem: '' });
  };

  deleteItem = (itemId) => {
    fetch(ITEMS_URL, {
      method: 'DELETE',
      body: JSON.stringify({ id: itemId }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((items) => {
        if (items.error) {
          alert(items.error);
        } else {
          this.setState({ items });
        }
      });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { items, todoItem, loading, offline } = this.state;

    return (
      <div className="App">
        <nav className="navbar navbar-light bg-light">
          <span className="navbar-brand mb-0 h1">
            <img src={logo} alt="App-logo" className="App-logo" />
            My Todo List
          </span>
          {offline && <span className="badge badge-danger my-3">Offline</span>}
          <span>
            <Link to="/profile">Profile</Link>
          </span>
        </nav>

        <div className="px-3 py-2">
          <form onSubmit={this.addItem} className="form-inline my-3">
            <div className="form-group mb-2 p-0 pr-3 col-8 col-sm-10">
              <input
                name="todoItem"
                type="text"
                className="form-control col-12"
                placeholder="What do you need to do?"
                value={todoItem}
                onChange={this.handleChange}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mb-2 col-4 col-sm-2"
            >
              Add
            </button>
          </form>

          {loading && <p>Loading...</p>}
          {!loading && items.length === 0 && (
            <div className="alert alert-secondary">No items - all done!</div>
          )}
          {!loading && items && (
            <table className="table table-striped">
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id} className="row">
                    <td className="col-1">{i + 1}</td>
                    <td className="col-10">{item.item}</td>
                    <td className="col-1">
                      <button
                        className="close"
                        type="button"
                        aria-label="Close"
                        onClick={() => this.deleteItem(item.id)}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}

export default () => (
  <Router>
    <div>
      <Route path="/" exact component={List} />
      <Route path="/profile" exact component={Profile} />
    </div>
  </Router>
);
