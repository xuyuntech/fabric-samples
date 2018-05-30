import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import omit from 'lodash.omit';
import bFetch from '../../bfetch';

const NOOP = () => {};

const propTypes = {
  url: PropTypes.string,
  method: PropTypes.string,
  data: PropTypes.object,
  params: PropTypes.object,
  onClick: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

export default class extends React.Component {
  static propTypes = propTypes;
  static defaultProps = {
    method: 'get',
    data: {},
    params: {},
    onClick: NOOP,
    onSuccess: NOOP,
    onError: NOOP,
  };
  state = {
    loading: false,
  };
  onClick = async () => {
    const { url, method, data, params, onSuccess, onError } = this.props;
    if (!url) {
      this.props.onClick();
      return;
    }
    this.setState({
      loading: true,
    });
    const options = {
      method,
      data: JSON.stringify(data),
      params,
    };
    try {
      const res = await bFetch(url, options);
      onSuccess(res.results);
    } catch (err) {
      onError(err);
    }
    this.setState({
      loading: false,
    });
  };
  render() {
    const { children, ...props } = this.props;
    const { loading } = this.state;
    return (
      <Button
        {...omit(props, Object.keys(propTypes))}
        loading={loading}
        onClick={this.onClick}
      >
        {children}
      </Button>
    );
  }
}
