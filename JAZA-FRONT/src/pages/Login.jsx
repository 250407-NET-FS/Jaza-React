import React from 'react'

function Login() {
  return (
    <>
        <h1>User Login</h1>
        {
            /* if an error occurs
                <div class="alert alert-danger" role="alert">
                    @TempData["ErrorMessage"]
                </div>
            */
        }

        {
            /* if the auth worked
                <div class="alert alert-success" role="alert">
                    @TempData["SuccessMessage"]
                </div>
            */
        }
        <hr />
        <div className="row">
            <div className="col-md-4">
                <form method="post">
                    {/* Email*/}
                    <div className="text-danger"></div>
                    <div className="form-group">
                        <label className="control-label"></label>
                        <input className="form-control" />
                        <span className="text-danger"></span>
                    </div>
                    {/* Password*/}
                    <div className="form-group">
                        <label className="control-label"></label>
                        <input className="form-control" />
                        <span className="text-danger"></span>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Login" className="btn btn-outline-dark" />
                    </div>
                </form>
            </div>
        </div>

        <div>
            <p>Don't have an account? <a className="btn btn-outline-dark">Register</a></p>
        </div>
    </>
  )
}

export default Login