import React from 'react'

function UserList() {
  return (
    <div className="container">
    <h1 className="text-center">User List</h1>
        <div className="row">
            <div className="col">
                <h2>User</h2>
                {/* TODO: Obtain all user info from list*/}
                <p>user@email.com (Confirmed?)</p>
                <p>[Insert Phone Here] (Confirmed?)</p>
                {/* TODO: Have switch funcitonality for deativate and ban buttons*/}
                <button className="btn btn-danger">Deactivate User</button>
                <button className="btn btn-danger">Activate User</button>
                <form method="post">
                    <button type="submit" className="btn btn-danger">
                        BAN
                    </button>
                </form>
                <form method="post">
                    <button type="submit" className="btn btn-danger">
                        UNBAN
                    </button>
                </form>
                <form method="post">
                    <button type="submit" className="btn btn-danger">
                        Delete
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default UserList