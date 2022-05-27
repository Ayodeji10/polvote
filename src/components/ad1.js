import React, { Component } from 'react'

class Ad1 extends Component {

    componentDidMount() {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
    }

    render() {
        return (
            <div>
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-8526972460998976"
                    data-ad-slot={2804702051}
                    data-ad-format="auto"
                    data-full-width-responsive="true" />
            </div>
        )
    }
}

export default Ad1