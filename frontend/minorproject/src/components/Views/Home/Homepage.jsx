import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
const HomePage = () => {
  const navigate = useNavigate()

  useEffect(()=> {  
      const intervalId = setInterval(()=> {

        const expiresAt = localStorage.getItem('expiresAt');
        console.log(expiresAt)
    
        if(expiresAt){
          const currentTime = Date.now()
          const expiriationTime = parseInt(expiresAt, 10) + 30 * 60 * 1000 ;
    
          if(currentTime > expiriationTime){
            console.log('yash')
          const removeItem = localStorage.removeItem('authToken')
            localStorage.removeItem('expiresAt')
           console.log(removeItem)
            navigate('/login')
          }
        }
      }, 10000)

        return  () => clearInterval(intervalId);

      }, [navigate])
  return (
    <> 
       Welcome
    </>
  )
}

export default HomePage
