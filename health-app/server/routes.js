// SPDX-License-Identifier: Apache-2.0

import api from './api';

const { store } = api;

export default (app) => {
  app.get('/queryAllStore', (req, res) => {
    store.queryAllStore(req, res);
  });
};

