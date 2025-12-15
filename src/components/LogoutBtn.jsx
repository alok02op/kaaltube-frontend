import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { authService } from '../backend'
import { clearVideos, logout } from '../store'
import { Button, Confirm } from '../components'

const LogoutBtn = () => {
  const dispatch = useDispatch()
  const [showConfirm, setShowConfirm] = useState(false);

  const logoutHandler = async () => {
    try {
      await authService.logoutUser()
      dispatch(logout())
      dispatch(clearVideos())
    } catch (e) {
      console.error("LogoutBtn error: ", e)
    }
  }

  return (
    <>
      <Button
        onClick={() => {setShowConfirm(true)}}
        variant="destructive" // shadcn/ui standard for danger buttons
        size="sm" // optional, makes it compact if used in a navbar/sidebar
      >
        Logout
      </Button>
      {showConfirm && (
        <Confirm
          headingText="Do you want to logout?"
          handleConfirm={logoutHandler}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  )
}

export default LogoutBtn


// import { useDispatch } from 'react-redux'
// import { authService } from '../backend'
// import { logout } from '../store'
// import { Button } from '../components'

// const LogoutBtn = () => {
//   const dispatch = useDispatch()

//   const logoutHandler = () => {
//     authService.logoutUser()
//       .then(() => dispatch(logout()))
//       .catch((e) => console.error("LogoutBtn error: ", e))
//   }

//   return (
//     <Button onClick={logoutHandler} variant="danger">
//       Logout
//     </Button>
//   )
// }

// export default LogoutBtn
