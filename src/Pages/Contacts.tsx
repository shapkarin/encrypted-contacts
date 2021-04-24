import React, { Component } from 'react';
import { Switch, Router, Route, Link, withRouter, HashRouter } from 'react-router-dom';
import connect from 'react-redux-connect';
import { Typography, Space, Input, Tooltip, Button, Row, Col, Layout, Divider } from 'antd';
import { LockFilled } from '@ant-design/icons';

import { load, create, update, remove, show } from '../Actions/contacts';
import { getCurrentContact } from '../Selectors/contacts';
import ContactDetails from '../Components/ContactDetails';
import ContactForm from '../Components/ContactForm';

import { history } from '../App'

const { Title, Text } = Typography;
const { Header, Sider, Content, Footer } = Layout;

@connect
class Contacts extends Component {
  static mapDispatchToProps = {
    load,
    create,
    update,
    remove,
    show,
  }

  static mapStateToProps = ({ contacts: { collection, current }}) => ({
    contacts: Object.keys(collection).map(key => collection[key]).sort((a, b) => a.name - b.name),
    collection,
    current: getCurrentContact({ collection, current }),
  })

  async componentDidMount() {
    await this.props.load();
    const { contacts: [first], show } = this.props;

    if(first) show(first.id);
  }

  add = async (event) => {
    event.preventDefault();

    const { create, history: { push: navigate }, match: { url } } = this.props;
    const {
      target: {
        elements: {
          name: { value: name },
          phone: { value: phone },
          email: { value: email },
          address: { value: address }
        }
      }
    } = event;

    await create({ name, phone, email, address });
    navigate(url);
  }

  update = async (event) => {
    event.preventDefault();

    const { update, current: { id }, history: { push: navigate }, match: { url } } = this.props;
    const {
      target: {
        elements: {
          name: { value: name },
          phone: { value: phone },
          email: { value: email },
          address: { value: address }
        }
      }
    } = event;

    await update({ id, name, phone, email, address });
    navigate(url);
  }

  render () {
    const { contacts, collection, current, remove, show } = this.props;

    return (
      <Layout>
        <Sider theme="light">
          <aside>
            {contacts.map(({ name, id }) => (
              <div
                key={id}
                onClick={() => show(id)}
                style={{ cursor: 'pointer' }}
              >
              { name }
            </div>
            ))}
          </aside>
        </Sider>
        <Content style={{background: 'white'}}>
          <HashRouter history={history}>
            <Switch>
              <Route
                exact
                path={this.props.match.path}
                component={ContactDetails}
              />
              <Route
                path={`${this.props.match.path}/edit`}
                render={(props) => (
                  <ContactForm
                    {...props}
                    onSubmit={this.update}
                    contact={current}
                    edit={true}
                  />
                )}
              />
              <Route
                path={`${this.props.match.path}/add`}
                render={(props) => (
                  <ContactForm {...props} onSubmit={this.add} />
                )}
              />
            </Switch>
          </HashRouter>
          <Button type="primary" onClick={() => this.props.history.push(`${this.props.match.url}/add`)}>Add new contact</Button>
        </Content>
      </Layout>
    )
  }
}

export default withRouter(Contacts);
