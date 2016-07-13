import React, { Component, PropTypes } from 'react';
import DrawBoard from '../components/draw/DrawBoard';
import ShowBoard from '../components/draw/ShowBoard';
import '../components/draw/draw.less';

export default class Draw extends Component{
    constructor(props){
        super(props);
        this.state = {
            player : 0
        }
    }

    render(){
        let renderNode;
        switch (this.state.player) {
            case 1:
                renderNode = <DrawBoard
                                ready={()=>io()}
                                drawEnd={()=>{console.log('stop')}} />
                break;
            case 2:
                renderNode = <ShowBoard ready={()=>io()} />
               break;
            default:
                renderNode = (<div className="draw-wrap flex-box">
                                <a onClick={()=>this.setState({player:1})} title="我来画">我来画</a>
                                <a onClick={()=>this.setState({player:2})} title="我来猜">我来猜</a>
                            </div>)
        }

        return (
            <div>{renderNode}</div>
        );
    }
}
