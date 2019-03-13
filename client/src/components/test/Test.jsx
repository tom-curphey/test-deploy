import React, { Component } from 'react';
import axios from 'axios';

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idToBeDeleted: '',
      itemToUpdate: '',
      item: {
        name: ''
      }
    };
  }

  async getData() {
    console.log('Getting Data..');
    const res = await axios.get('/api/item');
    return await res.data; // (Or whatever)
  }

  async postData(data) {
    const res = await axios.post('/api/item', data);
    console.log('Sent Data..');

    return await res.data; // (Or whatever)
  }

  async deleteData(data) {
    console.log('ID: ', data);
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/item/${data}`
      );
      console.log('Deleting Data..');
      return await res.data; // (Or whatever)
    } catch (err) {
      console.log('Error Mesage:', err);
    }
  }

  async updateData(id, data) {
    console.log('ID: ', id);
    console.log('Data: ', data);
    try {
      const res = await axios.put(
        `http://localhost:4000/api/item/${id}`,
        data
      );
      console.log('Updating Data..');
      return await res.data; // (Or whatever)
    } catch (err) {
      console.log('Error Mesage:', err);
    }
  }

  componentDidMount() {
    this.getData()
      .then(data => {
        console.log(data);
        this.setState({ items: data.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Update To Database Called');
    console.log('PrevState', prevState.itemToUpdate);
    console.log('State', this.state.itemToUpdate);
    console.log('PrevProps', prevProps);

    // Typical usage (don't forget to compare props):
    if (
      this.state.item !== prevState.item ||
      this.state.idToBeDeleted !== prevState.idToBeDeleted ||
      this.state.itemToUpdate !== prevState.itemToUpdate
    ) {
      this.getData()
        .then(data => {
          console.log(data);
          this.setState({ items: data.data });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      return this.state;
    }
  }

  handleChange = e => {
    this.setState({ item: { [e.target.name]: e.target.value } });
  };

  handleUpdateChange = e => {
    const { itemToUpdate } = this.state;

    this.setState({
      itemToUpdate: {
        ...itemToUpdate,
        [e.target.name]: e.target.value
      }
    });
  };

  // Why is this a binding function?
  async handleDelete(id) {
    // async deleteData(id)
    // console.log('idBefore: ', this.state.idToBeDeleted);
    await this.setState({ idToBeDeleted: id });
    // console.log('idToBeDeleted: ', this.state.idToBeDeleted);
    await this.deleteData(id);
    await this.setState({ idToBeDeleted: '' });
  }

  handleSetUpdateState = id => {
    const itemToUpdate = this.state.items.filter(
      item => item._id === id
    );
    // It only returns one value so we can retrieve it with [0]
    // console.log(itemToUpdate[0]);
    this.setState({ itemToUpdate: itemToUpdate[0] });
  };

  handleSubmit = e => {
    e.preventDefault();
    // console.log(this.state);
    this.postData(this.state.item);
    this.setState({ item: { name: '' } });
  };

  handleUpdateSubmit = e => {
    e.preventDefault();
    console.log(this.state);
    const { itemToUpdate } = this.state;
    console.log('Just before update: ', itemToUpdate);
    this.updateData(itemToUpdate._id, itemToUpdate);
    this.setState({ itemToUpdate: '' });
  };

  render() {
    const { items, item, itemToUpdate } = this.state;
    return (
      <div>
        <h1>Test</h1>
        {items && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 400px'
            }}
          >
            <ul>
              {items.map((item, index) => (
                // The key needs to be a string..
                <li
                  key={index}
                  id={item._id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 20px',
                    marginBottom: '5px'
                  }}
                >
                  <span
                    onClick={() =>
                      this.handleSetUpdateState(item._id)
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    {item.name}
                  </span>
                  <button onClick={() => this.handleDelete(item._id)}>
                    x
                  </button>
                </li>
              ))}
            </ul>
            <div style={{ marginLeft: '200px' }}>
              {itemToUpdate && (
                <form method="PUT">
                  <h3>Update {itemToUpdate.name}</h3>
                  <input
                    type="text"
                    name="name"
                    value={itemToUpdate.name}
                    onChange={this.handleUpdateChange}
                  />
                  <button
                    onClick={this.handleUpdateSubmit}
                    type="submit"
                    style={{ marginTop: '20px' }}
                  >
                    Update Item
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        <hr />
        <form method="POST">
          <label htmlFor="item">Item: </label>
          <input
            onChange={this.handleChange}
            type="text"
            name="name"
            value={item.name}
          />
          <button onClick={this.handleSubmit} type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default Test;
