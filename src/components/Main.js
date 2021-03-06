import React from 'react'
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import FileForm from './FileForm'
import Form from './Form'
import SideBar from './SideBar'
import GoDataActions from '../api/GoDataActions'
import Dhis2Actions from '../api/Dhis2Actions'

const Main = () => {
  return (
    <Router>
        <SideBar />
        <Switch>
          <Route exact path="/credentials" component={ FileForm }/>
          <Route exact path="/settings" component={ Form }/>
          <Route exact path="/export" component={ GoDataActions }/>
          <Route exact path="/import" component={ Dhis2Actions }/>
        </Switch>
    </Router>
  )
}

export default Main
