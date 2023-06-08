import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import {Link} from "react-router-dom";

const Footer = () => {
  return (
    <footer>
        <div  id="sub-footer" className="">
            <div className="container">
                <div className="row">

                    <p className="pull-left pull-right-reset-xs">Copyright © Zoomheavy 2023. All rights reserved.
                        <br/> Powered by <Link to={'/'}>Zoomheavy</Link>
                    </p>


                </div>
            </div>

        </div>
    </footer>
  )
}

export default Footer
