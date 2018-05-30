import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon } from 'antd';
import Button from '../Button';
import bFetch from '../../bfetch';

const NOOP = () => {};

class Comp extends React.Component {
  static displayName = 'Table';
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    url: PropTypes.string.isRequired,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    params: PropTypes.object,
    onLoad: PropTypes.func,
    fetchOptions: PropTypes.object,
    tools: PropTypes.arrayOf(PropTypes.element),
    refreshable: PropTypes.bool,
  };
  static defaultProps = {
    params: {},
    onLoad: NOOP,
    fetchOptions: {},
    tools: [],
    refreshable: false,
  };
  state = {
    loading: false,
    data: null,
    pagination: {},
  };
  componentDidMount() {
    this.fetch();
  }
  reload(opt) {
    this.fetch(opt);
  }
  async fetch({ current, pageSize, params } = {}) {
    this.setState({
      loading: true,
    });
    const { url } = this.props;
    try {
      const res = await bFetch(url, {
        params: {
          currentPage: current,
          pageCount: pageSize,
          ...this.props.params,
          ...params,
        },
        ...this.props.fetchOptions,
      });
      const { data, pagination } = res.results || {};
      this.setState({
        loading: false,
        data,
        pagination: {
          current: pagination.currentPage,
          total: pagination.totalCount,
        },
      });
      this.props.onLoad(null, res);
    } catch (e) {
      this.setState({
        loading: false,
      });
      this.props.onLoad(e, null);
    }
  }
  handleTableChange = (pagination) => {
    this.fetch(pagination);
  };
  getTools() {
    const { tools, refreshable } = this.props;
    const { loading } = this.props;
    const tTools = [].concat(tools);
    if (!tools.length && !refreshable) {
      return null;
    }
    if (refreshable) {
      tTools.push(<Button loading={loading} onClick={this.reload}>
        <Icon type="reload" />
                  </Button>);
    }

    return (
      <p>
        {tTools.map((item, key) =>
          // React.cloneElement 可以复制一个组件，以便修改属性
           React.cloneElement(item, { key }))}
      </p>
    );
  }
  render() {
    const { columns, rowKey } = this.props;
    const { loading, data, pagination } = this.state;
    console.trace('data', data);
    return (
      <div>
        {this.getTools()}
        <Table
          {...this.props}
          rowKey={rowKey}
          loading={loading}
          bordered
          dataSource={data}
          columns={columns}
          pagination={pagination}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default Comp;
