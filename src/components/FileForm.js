import React, { useState } from 'react'
import { AlertBar, Button, Card } from '@dhis2/ui-core'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import i18n from '@dhis2/d2-i18n' //do translations!
import { getInstance } from 'd2'
import _ from 'lodash'
import '../styles/FileForm.css'
import config from '../utils/config'


const FileForm = ({ cryptr }) => {
    const [formData, setFormData] = useState(config)
    const [isOk, setOk] = useState(true)
    const [isUploaded, setUploaded] = useState(false)
    const [wrong, setWrong] = useState(false)
    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)
    
    function onFormSubmit() {

        async function submit(data) {
            const d2 = await getInstance()
            if(await d2.currentUser.dataStore.has("interoperability")) {
                const namespace = await d2.currentUser.dataStore.get("interoperability")
                await namespace.set("cred-config", data)
            } else {
                const namespace = await d2.currentUser.dataStore.create("interoperability")
                await namespace.set("cred-config", data)
            }
        }

        if (isOk === true) {
            const conf = _.cloneDeep(formData)
            const godataPass =  formData.GoDataAPIConfig.credentials.password
            const dhis2Pass = formData.DHIS2APIConfig.credentials.password

            conf.GoDataAPIConfig.credentials.password = cryptr.encrypt(godataPass)
            conf.DHIS2APIConfig.credentials.password = cryptr.encrypt(dhis2Pass)
            submit(conf)
            setUploaded(true)
        } else {
            setWrong(true)
        }
    }

    //to handle text inputs
    function handleOnChange(event) {
        setOk(true)
        const { value, name } = event.target
        if (value === '') {
            setOk(false)
        }
        const query = name.split('.')
        switch(query.length) {
            case 1: 
                setFormData(prevData => ({ 
                    ...prevData,
                    [name] : value 
                }))
                break
            case 2: 
                setFormData(prevData => ({ 
                    ...prevData,
                    [query[0]] : {
                        ...prevData[query[0]],
                        [query[1]]: value
                    } 
                }))
                break
            case 3: 
                setFormData(prevData => ({ 
                    ...prevData,
                    [query[0]] : {
                        ...prevData[query[0]],
                        [query[1]] : {
                            ...prevData[query[0]][query[1]],
                            [query[2]]: value
                        }
                    } 
                }))
                break
            default: break       
        }     
    }

    const handleClickShowPassword1 = () => {
        setShow1((prevState) => !prevState)
    }
    const handleClickShowPassword2 = () => {
        setShow2((prevState) => !prevState)
    }
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }
    
    return (
        <div className="container"> 
            <div className="card"> 
                <Card className="card" dataTest="dhis2-uicore-card">
                    <div className="title-icon">
                        <VpnKeyIcon />
                        <h3>Import credentials</h3>
                    </div>
                    <div className="content">
                    <p className="p">GoData API Configuration</p>
                        <span className="subtitle">BaseURL:</span>
                        <input 
                            className="text-input" 
                            size="30"
                            name="GoDataAPIConfig.baseURL" 
                            value={ formData["GoDataAPIConfig"].baseURL }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Email:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="GoDataAPIConfig.credentials.email" 
                            value={ formData["GoDataAPIConfig"].credentials.email }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Password:</span>
                        <input 
                            className="text-input" 
                            type={ show1 ? "text" : "password" }
                            size="15"
                            name="GoDataAPIConfig.credentials.password" 
                            value={ formData["GoDataAPIConfig"].credentials.password }
                            onChange={ handleOnChange }
                        />
                        <IconButton
                            className="icon-button"
                            aria-label="toggle password visibility"
                            onClick={ handleClickShowPassword1 }
                            onMouseDown={ handleMouseDownPassword }
                        >
                            { show1 ? <Visibility /> : <VisibilityOff /> }
                        </IconButton>
                        <p className="p">Dhis2 API Configuration</p>
                        <span className="subtitle">BaseURL:</span>
                        <input 
                            className="text-input" 
                            size="30"
                            name="DHIS2APIConfig.baseURL" 
                            value={ formData["DHIS2APIConfig"].baseURL }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">User:</span>
                        <input 
                            className="text-input" 
                            size="15"
                            name="DHIS2APIConfig.credentials.user" 
                            value={ formData["DHIS2APIConfig"].credentials.user }
                            onChange={ handleOnChange }
                        />
                        <br />
                        <span className="subtitle">Password:</span>
                        <input 
                            className="text-input" 
                            type={ show2 ? "text" : "password" }
                            size="15"
                            name="DHIS2APIConfig.credentials.password" 
                            value={ formData["DHIS2APIConfig"].credentials.password }
                            onChange={ handleOnChange }
                        />
                        <IconButton
                            className="icon-button"
                            aria-label="toggle password visibility"
                            onClick={ handleClickShowPassword2 }
                            onMouseDown={ handleMouseDownPassword }
                        >
                            { show2 ? <Visibility /> : <VisibilityOff /> }
                        </IconButton>
                    </div>
                    <div className="import">
                        <Button
                            dataTest="dhis2-uicore-button"
                            name="button"
                            onClick={ onFormSubmit }
                            type="button"
                        >
                            Import
                        </Button>
                    </div>
                </Card>
            </div>
            <div className="alert-bars">
            { !isOk && 
                <AlertBar 
                    dataTest="dhis2-uicore-alertbar"
                    icon permanent warning
                >
                    Some fields are in blank
                </AlertBar> }
            { isUploaded && 
                <div>
                    <AlertBar 
                        dataTest="dhis2-uicore-alertbar"
                        icon permanent success
                    >
                        Credentials saved correctly
                    </AlertBar>
                </div> 
            }
            { wrong && 
                <div>
                    <AlertBar 
                        dataTest="dhis2-uicore-alertbar" 
                        icon permanent critical
                    >
                        Some fields are in blank
                    </AlertBar>
                </div> 
            }
            </div>
            
        </div>
    )
    
}

export default FileForm