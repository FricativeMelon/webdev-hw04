import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function memory_init(root, channel) {
  ReactDOM.render(<Memory channel={channel}/>, root);
}

class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = { revealed: false,
                   clicks: 0,
                   revealCount: 0,
                   pause: false}

    this.channel.join()
	  .receive("ok", this.gotView.bind(this))
	  .receive("error", resp => { console.log("Unable to join", resp) });
  }

  gotView(view) {
    function sendDonePause() {
      if (this.state.pause) {
        this.channel.push("donePause", {})
          .receive("ok", this.gotView.bind(this))
      }
    }
    console.log("new view", view);
    if (view.game.pause && !this.state.pause) {
      window.setTimeout(sendDonePause.bind(this), 1000);
    }
    this.setState(view.game);
  }

  sendClick(i, j) {
    return function(_ev) {
      this.channel.push("click", { i: i, j: j })
	.receive("ok", this.gotView.bind(this));
    }
  }

  sendInit(_ev) {
    this.channel.push("init", {})
	  .receive("ok", this.gotView.bind(this));
  }

  render() {
    let root = this
    function makeColumn(a, i, j) {
     if (a[i][j] != true) {
	if (a[i][j] != false) {
          return <div className="column">
	    <div className="letter">{a[i][j]}</div>
          </div>;
	} else { 
          return <div className="column">
            <div className="blank"></div>
          </div>;
	}
      } else {
        return <div className="column">
            <button className="tile" onClick={root.sendClick(i, j).bind(root)}>?</button>
        </div>;
      }
    }
    function makeRow(a, i) {
      return <div className="row">
        {makeColumn(a, i, 0)}
	{makeColumn(a, i, 1)}
	{makeColumn(a, i, 2)}
	{makeColumn(a, i, 3)}
      </div>;
    }
    function header() {
      return <div className="row">
      <div className="column"></div>
      <div className="column"><button onClick={root.sendInit.bind(root)}>Restart Game</button></div>
      <div className="column"><p>Score: {root.state.clicks}</p></div>
      <div className="column"></div></div>
    }

    if (this.state.revealed == false) {
        return <button onClick={this.sendInit.bind(this)}>Start Game</button>;
    } else if (this.state.revealCount >= 16) {
	return <div>{header()}
		    <p className="big">You win!</p>
	       </div>;
    } else {
        return <div>
	     {header()}
	     {makeRow(this.state.revealed, 0)} 
             {makeRow(this.state.revealed, 1)}
             {makeRow(this.state.revealed, 2)}
             {makeRow(this.state.revealed, 3)}
	     </div>;
    }
  }
}

