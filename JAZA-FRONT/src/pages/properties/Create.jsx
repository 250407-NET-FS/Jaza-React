import React from 'react'

function Create() {
  return (
    <>
        <h1>Create Property</h1>
        <hr />
        <div className="row">
            <div className="col-md-4">
                <form method="post">
                    <div className="text-danger"></div>
                    <div className="form-group">
                        <label className="control-label">Street Address</label>
                        <input className="form-control" />
                        <span className="text-danger"></span>
                    </div>
                    <div class="form-group">
                        <label className="control-label">City</label>
                        <input className="form-control" />
                        <span className="text-danger"></span>
                    </div>
                    <div className="form-group">
                        <label className="control-label">State</label>
                        <input className="form-control" />
                        <span className="text-danger"></span>
                    </div>
                    <div className="form-group"></div>
                    <label className="control-label">Zip Code</label>
                    <input className="form-control" />
                    <span className="text-danger"></span>

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
                        <label className="control-label">Bathrooms</label>
                        <input className="form-control" />
                        <span className="text-danger"></span>
                    </div>
                    <div className="form-group">
                        <label className="control-label">Starting Price</label>
                        <input className="form-control" />
                        <span className="text-danger"></span>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create" className="btn btn-outline-dark" />
                    </div>

                </form>
            </div>
        </div>
    </>
  )
}

export default Create;