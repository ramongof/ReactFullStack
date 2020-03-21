import React from 'react'

const Notification = ({ message, classType }) => {    
    if(message === null){        
        return null    
    }
    return(
        <div className={classType}>
            {message}
        </div>
    )
}

export default Notification