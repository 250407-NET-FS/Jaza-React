import React from 'react'

function Register() {
  return (
    <>
        <h1>User Registration</h1>
        <hr />
        <div className="row">
            <div className="col-md-4">
                <form method="post">
                    <div className="text-danger"></div>
                    <div className="form-group">
                        {/* email*/}
                        <label className="control-label">Email</label>
                        <input className="form-control" />
                        <span className="text-danger"></span>
                    </div>
                    <div className="form-group">
                        {/* Full Name*/}
                        <label className="control-label">Full Name</label>
                        <input className="form-control" />
                        <span className="text-danger"></span>
                    </div>
                    <div className="form-group">
                        {/* Password*/}
                        <label className="control-label"></label>
                        <input className="form-control" />
                        <span className="text-danger"></span>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Register" className="btn btn-outline-dark" />
                    </div>
                </form>
            </div>
        </div>

        <div>
            <p>Already have an account? <a className="nav-link text-dark btn btn-outline-dark">Login</a></p>
        </div>
    </>
  )
}

export default Register