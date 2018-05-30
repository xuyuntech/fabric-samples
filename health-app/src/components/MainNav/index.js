import React from 'react';
import { NavLink } from 'react-router-dom';

export default class extends React.Component {
  render() {
    return (
      <nav id="mainnav-container">
        <div id="mainnav" >
          <div id="mainnav-menu-wrap">
            <div className="nano">
              <div className="nano-content" >
                <ul id="mainnav-menu" className="list-group">
                  <li className="list-header">Navigation</li>
                  <li>
                    <NavLink exact to="/" activeClassName="active">
                      <i className="demo-pli-home" />
                      <span className="menu-title">Dashboard</span>
                    </NavLink>
                  </li>
                  <li>
                    <a href="javascript:void(0)">
                      <i className="demo-pli-home" />
                      <span className="menu-title">挂号管理</span>
                      <i className="arrow" />
                    </a>
                    <ul className="collapse">
                      <li>
                        <NavLink to="/arrangement" activeClassName="active">
                          <i className="demo-pli-home" />
                          <span className="menu-title">排班管理</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/inventorySync" activeClassName="active">
                          <i className="demo-pli-home" />
                          <span className="menu-title">排班规则</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/inventorySync" activeClassName="active">
                          <i className="demo-pli-home" />
                          <span className="menu-title">排班记录</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/inventorySync" activeClassName="active">
                          <i className="demo-pli-home" />
                          <span className="menu-title">挂号记录</span>
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <NavLink exact to="/hospitals" activeClassName="active">
                      <i className="demo-pli-home" />
                      <span className="menu-title">医院网点</span>
                      {/* <i className="arrow" /> */}
                    </NavLink>
                    {/* <ul className="collapse">
                      <li><Link to="/crawler/overview">概况</Link></li>
                      <li><a href="dashboard-2.html">新建爬虫</a></li>
                      <li><a href="dashboard-3.html">爬虫列表</a></li>
                    </ul> */}
                  </li>
                  <li>
                    <NavLink to="/doctors" activeClassName="active">
                      <i className="demo-pli-home" />
                      <span className="menu-title">医师管理</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/users" activeClassName="active">
                      <i className="demo-pli-home" />
                      <span className="menu-title">用户管理</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
