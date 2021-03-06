import React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { LoadingProvider } from 'd2-ui-components'
import OldMuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import muiThemeLegacy from './themes/dhis2-legacy.theme'
import { muiTheme } from './themes/dhis2.theme'
import { Provider } from '@dhis2/app-runtime'
import Header from './Header'
import Main from './Main'


const App = ({ config, appName }) => {

    return (
        <Provider config={ config }>
            <MuiThemeProvider theme={ muiTheme }>
                <OldMuiThemeProvider muiTheme={ muiThemeLegacy }>
                    <LoadingProvider>
                        <Header appName={ appName }/>
                        <Main />
                    </LoadingProvider>
                </OldMuiThemeProvider>
            </MuiThemeProvider>
        </Provider>
    )
}

export default App
