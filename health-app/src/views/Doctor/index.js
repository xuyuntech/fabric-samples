import React from 'react';
import { Icon, Divider } from 'antd';
import { Link } from 'react-router-dom';
import Table from '../../components/Table';

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  render: text => <Link to={`/crawler/task/${text}`}>{text}</Link>,
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}, {
  title: '电话',
  dataIndex: 'phone',
  key: 'phone',
  render: (text, record) => (record.phone1 ? `${record.phone1} - ${record.phone2}` : record.phone2),
}, {
  title: 'Action',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href="javascript:;">Action 一 {record.name}</a>
      <Divider type="vertical" />
      <a href="javascript:;">Delete</a>
      <Divider type="vertical" />
      <a href="javascript:;" className="ant-dropdown-link">
        More actions <Icon type="down" />
      </a>
    </span>
  ),
}];


export default class extends React.Component {
  render() {
    return (
      <div>
        <div className="panel">
          <div className="panel-heading">
            <h3 className="panel-title">医院网点</h3>
          </div>
          <div className="panel-body">
            <Table refreshable rowKey="key" url="http://localhost:8000/queryAllStore" size="small" columns={columns} />
          </div>
        </div>
      </div>
    );
  }
}
