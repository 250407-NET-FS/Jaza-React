import React from 'react'

function Retrieve() {
  return (
    <>
        <div className="row">
            <div className="col">
                <h1>Property List</h1>
            </div>
            <div className="col">
                {/* TODO: Change the button color to a dark outline if favorite not marked*/}
                <button className="btn btn-dark pull-right">Save</button>
            </div>
        </div>


        <div className="row">
            <div className="col">
                {/* <img src="../wwwroot/11993-NOQXLF.jpg"/> */}
            </div>
        </div>
        {/* TODO: Fill in property info for a specified property based on its id*/}
        <div className="row">
            <div className="col">
                <pre>$0.00
                    Address, City, State ZipCode
                </pre>
            </div>
            <div className="col">
                <p>1 beds</p>
                <p>1 baths</p>
            </div>
        </div>
        <div className="row">
            <div className="col">
                <p>0 days</p>
            </div>
        </div>
        <div className="row">
            <p>Listing Created: Today</p>
            <p>Listed by: Owner</p>
        </div>
    </>
  )
}

export default Retrieve