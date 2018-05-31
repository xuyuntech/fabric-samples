// SPDX-License-Identifier: Apache-2.0

import api from './api';

const { store, user } = api;

export default (app) => {
  app.get('/queryAllStore', (req, res) => {
    store.queryAllStore(req, res);
  });
  app.get('/queryAllUser', user.queryAllUser);
};

