import React from 'react'

function OwnerPropertyList() {
  return (
    <div className="container">
        <h1 className="text-center">Your Listings</h1>
        {/* TODO: Iterate over each property owner by the logged owner*/}
        <div className="row row-cols-1 row-cols-md-4 g-4">
            <div className="col">
                <div className="card h-100">
                    <div className="card-body">
                        <h5 className="card-title">Street Address</h5>
                        <p className="card-text">
                            City, State ZipCode<br />
                            Beds: 1 Baths: 1<br />
                            Price: $0.00:C
                        </p>
                        <a className="btn btn-sm btn-primary">Edit</a>
                        <form method="post" className="d-inline">
                            <button type="submit" className="btn btn-sm btn-danger">
                                Delete
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    {
        /* If there are no listings
            <p class="text-muted">You have no listings yet.</p>
        */
    }
    </div>
  )
}

export default OwnerPropertyList