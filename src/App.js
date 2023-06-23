import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Splash from './Splash';
import SignIn from './SignIn';
import SignUp from './SignUp';
import SignUpGeneral from './SignUpGeneral';
import SignUpOwner from './SignUpOwner';
import SignUpOwnerAdd from './SignUpOwnerAdd';
import OwnerCreateTable from './OwnerCreateTable';
import Main from './Main';
import Info from './Info';
import AAAAsuccess from './AAAAsuccess';
// import Contact from './Contact';
// import Reservation from './Reservation';
// import Share from './Share';
// import Like from './Like';

function App() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  }, []);

  return (
    <div>
      {isVisible && <Splash />}
      {!isVisible && (
        <BrowserRouter>
            <Routes>
            <Route path='/' exact element={<SignIn />} />
            <Route path='/AAAAsuccess' element={<AAAAsuccess />} />
            <Route path='/SignIn' element={<SignIn />} />
            <Route path='/SignUp' element={<SignUp />} />
            <Route path='/SignUpGeneral' element={<SignUpGeneral />} />
            <Route path='/SignUpOwner' element={<SignUpOwner />} />
            <Route path='/SignUpOwnerAdd' element={<SignUpOwnerAdd />} />
            <Route path='/OwnerCreateTable' element={<OwnerCreateTable />} />
            <Route path='/Main' element={<Main />} />
            <Route path='/Info' element={<Info />} />
            {/* <Route path='/Contact' element={<Contact />} />
            <Route path='/Reservation' element={<Reservation />} />
            <Route path='/Share' element={<Share />} />
            <Route path='/Like' element={<Like />} /> */}
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;