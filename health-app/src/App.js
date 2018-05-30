import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import LoadingComp from './components/Loadable';
import Layout from './components/Layout';
import './App.css';


const load = asyncImport => Loadable({
  loader: asyncImport,
  loading: LoadingComp,
});

export const HomeView = load(() => import('./views/Home'));
export const HospitalView = load(() => import('./views/Hospital'));
export const DoctorView = load(() => import('./views/Doctor'));
export const UserView = load(() => import('./views/User'));
export const ArrangementView = load(() => import('./views/Arrangement'));

@observer
class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <div>
            <Route exact path="/" component={HomeView} />
            <Route exact path="/hospitals" component={HospitalView} />
            <Route exact path="/doctors" component={DoctorView} />
            <Route exact path="/users" component={UserView} />
            <Route exact path="/arrangement" component={ArrangementView} />
          </div>
        </Layout>
      </Router>

    );
  }
}

export default App;
