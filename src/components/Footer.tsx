import React, { FC, ReactElement } from "react";
import '../styles/footer.scss';
import { Layout } from 'antd';

const { Footer } = Layout;

const PortalFooter: FC = (): ReactElement => {
    return (
        <Footer>
            <span>GeoAI & Spatiotemporal Visual Analytics Lab @ Wuhan University</span>
            {/* <a href="https://github.com/zpguigroupwhu" rel="noopener noreferrer" target="_blank"> GeoAI & Spatiotemporal Visual Analytics Lab @ Wuhan University</a> */}
        </Footer>
    )
}

export default PortalFooter;