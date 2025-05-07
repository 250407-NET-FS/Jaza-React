import React from 'react'

function Update() {
  return (
    <>
        <h1>Edit Property</h1>
        <hr />
        <div className="row">
            <div className="col-md-4">
                <form method="post">
                    <div className="text-danger"></div>
                    <div className="form-group">
                        <label className="control-label">Street Address</label>
                        <input className="form-control"/>
                        <span className="text-danger"></span>
                    </div>
                    <div className="form-group">
                        <label className="control-label">City</label>
                        <input className="form-control" />
                        <span className="text-danger"></span>
                    </div>
                    <div className="form-group">
                        <label className="control-label">State</label>
                        <input className="form-control" />
                        <span className="text-danger"></span>
                    </div>
                    <div className="form-group">
                        <label className="control-label">Country</label>
                        <input className="form-control" />
                        <span className="text-danger"></span>
                    </div>
                    <div className="form-group">
                        <label className="control-label">Bedrooms</label>
                        <input className="form-control" />
                        <span className="text-danger"></span>
                    </div>
                    <div className="form-group">
                        <label className="control-label"></label>
                        <input className="form-control" />
                        <span className="text-danger"></span>
                    </div>
                    <div className="form-group">
                        <label className="control-label">Starting Price</label>
                        <input className="form-control" />
                        <span className="text-danger"></span>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Update" className="btn btn-outline-dark" />
                    </div>
                </form>
            </div>
        </div>
    </>
  )
}

export default Update