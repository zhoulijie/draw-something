import React,{Component} from 'react';
import '../draw/draw.less';
export default class DrawBoard extends Component{

    constructor(props) {
        super(props);
        this.state = {
            ctx : null,
            mousePressed : false,
            lineValue : 3,
            colorValue : 'red',
            beginX: 0,
            beginY: 0,
            endX: 0,
            endY: 0
        }
    }

    mouseDownHandel(e){
        this.setState({
            mousePressed : true
        });
        this.drawing(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop, false);
    }

    mouseMoveHandel(e){
        if (this.state.mousePressed) {
            this.drawing(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop, true);
        }
    }

    setMousePressed(){
        this.setState({
            mousePressed : false
        })
    }

    mouseUpHandel(){
        this.setMousePressed();
        this.hasProps('drawEnd')();
    }

    hasProps(prop){
        if(!prop){
            return false
        };

        var propName;
        if( this.props.route && this.props.route[prop] ){
            propName = this.props.route[prop];
        }

        if (this.props[prop]) {
            propName = this.props[prop];
        }

        if(propName){
            return propName;
        }

        return false;
    }

    ready() {
        let ready = this.hasProps('ready'),
            el = this.refs.myCanvas,
            socket;
        if(ready){
            socket = ready();
            this.setState({
                socket : socket
            });
            socket.send('getKeyWord');
            socket.on('keyword', (keyword)=>{
                this.setState({
                    keyword
                })
            })
        }
        el = this.refs.myCanvas;
        this.setState({
            ctx : el.getContext("2d")
        });
    }

    drawChange(path){
        let change = this.hasProps('change');
        if(change){
            change({
                ...this.state
            });
        }

        this.state.socket.emit('drawPath',{
            beginX : this.state.beginX,
            beginY : this.state.beginY,
            endX : path.x,
            endY : path.y,
            lineValue : this.state.lineValue,
            colorValue : this.state.colorValue
        })
    }

    drawing(x, y, isDown) {
        var ctx,timer;
        if (isDown) {
            ctx = this.state.ctx;
            ctx.beginPath();
            ctx.strokeStyle = this.state.colorValue;
            ctx.lineWidth = this.state.lineValue;
            ctx.lineJoin = "round";
            ctx.moveTo(this.state.beginX, this.state.beginY);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
            this.drawChange({x,y});
        }
        this.setState({
            beginX : x,
            beginY : y
        })
    }

    clearArea() {
        var ctx = this.state.ctx;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.state.socket.send('clear');
    }

    componentDidMount(){
        this.ready();
    }

    render(){
        return (
            <div className="control-ops">
                <div className="item keyword">你要画: <strong style={{color:'#c00'}}>{this.state.keyword}</strong></div>
                <canvas ref="myCanvas"
                    onMouseDown={this.mouseDownHandel.bind(this)}
                    onMouseMove={this.mouseMoveHandel.bind(this)}
                    onMouseUp={this.mouseUpHandel.bind(this)}
                    onMouseLeave={this.setMousePressed.bind(this)}
                    width="500"
                    height="400"
                    style={{border:'1px solid #ccc'}}>
                </canvas>
                <div className="control-bar flex-box">
                    <div className="item">
                        <button type="button" className="btn btn-primary" onClick={this.clearArea.bind(this)}>画错了，重来！</button>
                    </div>
                    <div className="item">
                        笔尖力度:
                        <select
                            value={this.state.lineValue}
                            onChange={(e)=>this.setState({lineValue: e.target.value})}
                        >
                            <option value="1">1号笔芯</option>
                            <option value="3">3号笔芯</option>
                            <option value="5">5号笔芯</option>
                            <option value="7">7号笔芯</option>
                            <option value="9">9号笔芯</option>
                            <option value="11">11号笔芯</option>
                        </select>
                    </div>
                    <div className="item">
                        彩色水笔:
                        <select
                            value={this.state.colorValue}
                            onChange={(e)=>this.setState({colorValue: e.target.value})}
                        >
                            <option value="black">黑色</option>
                            <option value="blue">蓝色</option>
                            <option value="red">红色</option>
                            <option value="green">绿色</option>
                            <option value="yellow">黄色</option>
                            <option value="gray">灰色</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}
