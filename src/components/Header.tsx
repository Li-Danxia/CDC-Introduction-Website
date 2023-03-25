import React, { FC, ReactElement, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import '../styles/header.scss';
import {
    HomeOutlined,
    TeamOutlined
} from '@ant-design/icons';

const { Header } = Layout;

const items: MenuProps['items'] = [
    {
        label: (<Link to='/CDC-Introduction-Website/'>Home</Link>),
        key: '/CDC-Introduction-Website/',
        icon: <HomeOutlined />,
    },
    {
        label: (<Link to='/CDC-Introduction-Website/Developer'>Team</Link>),
        key: '/CDC-Introduction-Website/Developer',
        icon: <TeamOutlined />,
    },
]

const PortalHeader: FC = (): ReactElement => {
    const [current, setCurrent] = useState('/CDC-Introduction-Website/')
    const location = useLocation()
    const path: string = location.pathname

    useMemo(() => {
        if (path === '/CDC-Introduction-Website/Developer') {
            setCurrent(path)
        } else {
            setCurrent('/CDC-Introduction-Website/')
        }
    }, []);

    const onClick: MenuProps['onClick'] = e => {
        setCurrent(e.key)
    }

    return (
        <Header className="header">
            {/* <div className="header-logo">
                <img className="header-imag" />
                <span className="header-name">Name</span>
            </div> */}
            <Menu
                theme="dark"
                mode="horizontal"
                onClick={onClick}
                selectedKeys={[current]}
                items={items}
            />
        </Header>
    )
}

export default PortalHeader;