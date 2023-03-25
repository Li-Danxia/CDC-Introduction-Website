import React, { FC, ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import 'Introduction' and 'Developer' two pages
import Introduction from './pages/introduction';
import Developer from './pages/developer';
import PortalHeader from './components/Header';
import PortalFooter from './components/Footer';
import { Layout } from 'antd';

const App: FC = (): ReactElement => {
  return (
    <Router>
      <Layout className="App">
        <PortalHeader />
        {/* deploy routes */}
        <Routes>
          <Route path='/' element={<Introduction />} />
          <Route path='/CDC-Introduction-Website' element={<Introduction />} />
          <Route path='/CDC-Introduction-Website/Developer' element={<Developer />} />
        </Routes>
        <PortalFooter />
      </Layout>
    </Router>
  );
}

export default App;
