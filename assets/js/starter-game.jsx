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
    this.state = { letterMatrix: false,
	           firstSel: false,
	           secSel: false,
	           clicks: 0,
	           revealCount: 0
    };

    this.channel.join()
	  .receive("ok", this.gotView.bind(this))
	  .receive("error", resp => { console.log("Unable to join", resp) });
  }

  gotView(view) {
    console.log("new view", view);
    this.setState(view.game);
  }

  sendClick(ev) {
    this.channel.push("click", { letter: ev })
	  .receive("ok", this.gotView.bind(this));
  }

  reveal(i, j) {
    let root = this
    let next = function(_ev) {
      let x0 = root.state.firstSel[0]
      let y0 = root.state.firstSel[1]
      let x1 = root.state.secSel[0]
      let y1 = root.state.secSel[1]
      root.state.firstSel = false
      root.state.secSel = false
      if (root.state.letterMatrix[x0][y0].name == root.state.letterMatrix[x1][y1].name) {
        root.state.letterMatrix[x0][y0].name = false
        root.state.letterMatrix[x1][y1].name = false
	root.state.revealCount += 2
      } else {
        root.state.letterMatrix[x0][y0].revealed = false
        root.state.letterMatrix[x1][y1].revealed = false
      }
      root.setState(root.state)
    }
    return function(_ev) {
	if (root.state.secSel) {
          return
	} else if (root.state.firstSel) {
	  root.state.secSel = [i, j]
	  window.setTimeout(next, 1000)
	} else {
	  root.state.firstSel = [i, j]
	}
	root.state.clicks += 1
	root.state.letterMatrix[i][j].revealed = true
	root.setState(root.state)
    }
  }

  init(_ev) {
    function addFalse(a, b, c) {
        return { name:a, revealed:false }
    }
    let arr = ["A", "B", "C", "D", "E", "F", "G", "H"];
    arr = _.map(_.shuffle(arr.concat(arr)), addFalse);   
    arr = _.chunk(arr, 4);
    let state1 = _.assign({}, this.state, {letterMatrix: arr,
	                                   firstSel: false,
                                           secSel: false,
                                           clicks: 0,
                                           revealCount: 0});
    this.setState(state1);
  }

  render() {
    let root = this
    function makeColumn(a, i, j) {
     if (a[i][j].revealed) {
	if (a[i][j].name) {
          return <div className="column">
	    <div className="letter">{a[i][j].name}</div>
          </div>;
	} else { 
          return <div className="column">
            <div className="blank"></div>
          </div>;
	}
      } else if (a.secSel) {
	return <div className="column">
            <button className="tile" disabled>?</button>
        </div>;
      } else {
        return <div className="column">
            <button className="tile" onClick={root.reveal(i, j).bind(root)}>?</button>
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
      <div className="column"><button onClick={root.init.bind(root)}>Restart Game</button></div>
      <div className="column"><p>Score: {root.state.clicks}</p></div>
      <div className="column"></div></div>
    }

    if (this.state.letterMatrix == false) {
        return <button onClick={this.init.bind(this)}>Start Game</button>;
    } else if (this.state.revealCount >= 16) {
	return <div>{header()}
		    <p className="big">You win!</p>
	       </div>;
    } else {
        return <div>
	     {header()}
	     {makeRow(this.state.letterMatrix, 0)} 
             {makeRow(this.state.letterMatrix, 1)}
             {makeRow(this.state.letterMatrix, 2)}
             {makeRow(this.state.letterMatrix, 3)}
	     </div>;
    }
  }
}

