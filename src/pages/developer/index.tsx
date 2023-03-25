import React, { FC, ReactElement } from "react";
import '../../styles/developer.scss'

import {
    BulbOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    MailOutlined,
    ScheduleOutlined,
    TagOutlined,
    UserOutlined,
} from '@ant-design/icons';

import { Layout, Avatar, Divider } from 'antd';

const Developer: FC = (): ReactElement => {
    return (
        <Layout className='about'>
            <body>
                <h1 className='about_body_title'>Meet Our Group</h1>
                <div className='about_body_container_parent'>
                    <div className='about_body_container'>
                        <Avatar className='avatar' size={150} src={<img src={require('../../assets/images/introduction-images/Zhipeng Gui.png')} alt="Zhipeng Gui" />} />
                        <div className='about_body_container_description' style={{ marginTop: 10 }}>
                            <b style={{ fontSize: 30 + 'px' }}>Zhipeng Gui</b><br />
                            <span><ScheduleOutlined className="icon" /><b>  Role:  </b>Principal Investigator</span><br />
                            <span><BulbOutlined className="icon" /><b>  Position:  </b>Associate Professor</span><br />
                            {/* School of Remote Sensing and Information Engineering,  */}
                            <span><EnvironmentOutlined className="icon" /><b>  Affiliation:  </b>Wuhan University, Hubei, China</span><br />
                            <span><MailOutlined className="icon" /><b>  Email:  </b>zhipeng.gui@whu.edu.cn</span><br />
                            <span><HomeOutlined className="icon" /><b>  Homepage:  </b><a href="http://jszy.whu.edu.cn/ZhipengGui" target="_blank">http://jszy.whu.edu.cn/ZhipengGui</a></span><br />
                        </div>
                    </div>
                    <div className='about_body_container'>
                        <Avatar className='avatar' size={150} src={<img src={require('../../assets/images/introduction-images/Dehua Peng.png')} alt="Dehua Peng" />} />
                        <div className='about_body_container_description'>
                            <b style={{ fontSize: 30 + 'px' }}>Dehua Peng</b><br />
                            <span><ScheduleOutlined className="icon" /><b>  Role:  </b>Algorithm Designer & Developer</span><br />
                            <span><BulbOutlined className="icon" /><b>  Position:  </b>Doctoral Student</span><br />
                            <span><EnvironmentOutlined className="icon" /><b>  Affiliation:  </b>Wuhan Univercity, Hubei, China</span><br />
                            <span><MailOutlined className="icon" /><b>  Email:  </b>pengdh@whu.edu.cn</span><br />
                        </div>
                    </div>
                </div>
                <Divider type='horizontal' />
                <div className='about_body_container_parent'>
                    <div className='about_body_container'>
                        <Avatar className='avatar' size={150} src={<img src={require('../../assets/images/introduction-images/Danxia Li.png')} alt="Danxia Li" />} />
                        <div className='about_body_container_description'>
                            <b style={{ fontSize: 30 + 'px' }}>Danxia Li</b><br />
                            <span><ScheduleOutlined className="icon" /><b>  Role:  </b>Front-end Developer</span><br />
                            <span><BulbOutlined className="icon" /><b>  Position:  </b>Postgraduate</span><br />
                            <span><EnvironmentOutlined className="icon" /><b>  Affiliation:  </b>Wuhan Univercity, Hubei, China</span><br />
                            <span><MailOutlined className="icon" /><b>  Email:  </b>lidx26@whu.edu.cn</span><br />
                        </div>
                    </div>
                    <div className='about_body_container'>
                        <Avatar className='avatar' size={150} src={<img src={require('../../assets/images/introduction-images/Yang Liu.jpg')} alt="Yang Liu" />} />
                        <div className='about_body_container_description'>
                            <b style={{ fontSize: 30 + 'px' }}>Yang Liu</b><br />
                            <span><ScheduleOutlined className="icon" /><b>  Role:  </b>Front-end Developer</span><br />
                            <span><BulbOutlined className="icon" /><b>  Position:  </b>Postgraduate</span><br />
                            <span><EnvironmentOutlined className="icon" /><b>  Affiliation:  </b>Wuhan Univercity, Hubei, China</span><br />
                            <span><MailOutlined className="icon" /><b>  Email:  </b>yang_liu@whu.edu.cn</span><br />
                        </div>
                    </div>
                </div>
                <Divider type='horizontal' />
                <div className='about_body_container_parent'>
                    <div className='about_body_container'>
                        <Avatar className='avatar' size={150} src={<img src={require('../../assets/images/introduction-images/Zicheng Huang.jpg')} alt="Zichen Huang" />} />
                        <div className='about_body_container_description'>
                            <b style={{ fontSize: 30 + 'px' }}>Zichen Huang</b><br />
                            <span><ScheduleOutlined className="icon" /><b>  Role:  </b>Back-end Developer</span><br />
                            <span><BulbOutlined className="icon" /><b>  Position:  </b>Postgraduate</span><br />
                            <span><EnvironmentOutlined className="icon" /><b>  Affiliation:  </b>Wuhan Univercity, Hubei, China</span><br />
                            <span><MailOutlined className="icon" /><b>  Email:  </b>zichen.huang@whu.edu.cn</span><br />
                        </div>
                    </div>
                    <div className='about_body_container'>
                        <Avatar className='avatar' size={150} src={<img src={require('../../assets/images/introduction-images/Yuncheng Ma.jpg')} alt="Yuncheng Ma" />} />
                        <div className='about_body_container_description'>
                            <b style={{ fontSize: 30 + 'px' }}>Yuncheng Ma</b><br />
                            <span><ScheduleOutlined className="icon" /><b>  Role:  </b>Experimental Tester</span><br />
                            <span><BulbOutlined className="icon" /><b>  Position:  </b>Doctoral Student</span><br />
                            <span><EnvironmentOutlined className="icon" /><b>  Affiliation:  </b>Wuhan Univercity, Hubei, China</span><br />
                            <span><MailOutlined className="icon" /><b>  Email:  </b>2020282130108@whu.edu.cn</span><br />
                        </div>
                    </div>
                </div>

                <div className='about_body_container_parent2'>
                    <div className='about_body_container2'>
                        <h1>Join Our Growing Team</h1>
                        <h2>We’re always looking for amazing people to join our team.
                            If you are also keen in <strong>conducting clustering algorithm research</strong>, <strong>GIS research</strong> or <strong>developing enjoyable websites</strong>,
                            then contact with us immediately! We are waiting for you all the time.
                        </h2>
                    </div>
                    <img src='https://d3ui957tjb5bqd.cloudfront.net/images/1/about/growing-illo.png?v2' style={{ float: 'left', paddingLeft: 180, paddingTop: 40 }} />
                </div>
            </body>
        </Layout>
    )
}

export default Developer;