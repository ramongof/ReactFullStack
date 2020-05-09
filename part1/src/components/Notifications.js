import React from 'react'

const Notification = ({ message, classType }) => {    
    let alert = null    
    if(message === null){        
        return null    
    }
    if(message.error){        
        alert = message.error
    }
    else{
        alert = message
    }
    return(
        <div className={classType}>
            {alert}
        </div>
    )
}

export default Notification