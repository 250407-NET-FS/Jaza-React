import React from 'react'

function Dashboard() {
  return (
    <div className="text-center">
        <h1 className="display-4">Welcome Admin!</h1>
        <div className="container">
            <div className="row">
                <div className="col-6">
                    <a className="link">View All Users</a>
                </div>
                <div className="col-6">
                    <a className="link" >View All Properties</a>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard