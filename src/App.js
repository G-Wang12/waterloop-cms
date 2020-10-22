import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import LandingPage from './pages/landing/LandingPage';
import GeesePage from './pages/geese/GeesePage';
import FeaturesPage from './pages/features/FeaturesPage';
import SignInPage from './pages/sign-in/SignInPage';
import TeamDesc from './pages/descriptions/TeamDesc';
import TopBar from './components/TopBar';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <>
            <TopBar />
            <LandingPage />
          </>
        </Route>
        <Route path="/geese" exact>
          <GeesePage />
        </Route>
        <Route path="/features" exact>
          <FeaturesPage />
        </Route>
        <Route path="/sign-in" exact>
          <SignInPage />
        </Route>
        <Route path="/descriptions" exact>
          <TeamDesc />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
