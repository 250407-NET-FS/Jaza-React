import React from 'react'

function PropertyList() {
  return (
    <div className="container">
    <h1 className="text-center">Property List</h1>
        <div className="row">
            {/* TODO: Display list of properties*/}
            <form method="post">{/* TODO: Connect a handler to the delete property controllerendpoint*/}
                <button type="submit" className="btn btn-danger">
                    Delete Listing
                </button>
            </form>
        </div>
    </div>
  )
}

export default PropertyList