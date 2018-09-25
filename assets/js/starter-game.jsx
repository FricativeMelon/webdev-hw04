import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Memory />, root);
}

class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.state = { letterMatrix: false,
	           firstSel: false,
	           secSel: false
                   };
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
      } else {
        root.state.letterMatrix[x0][y0].revealed = false
        root.state.letterMatrix[x1][y1].revealed = false
      }
      root.setState(root.state)
    }
    return function(_ev) {
	root.state.letterMatrix[i][j].revealed = true
	if (root.state.secSel) {
	} else if (root.state.firstSel) {
	  root.state.secSel = [i, j]
	  window.setTimeout(next, 1000)
	} else {
	  root.state.firstSel = [i, j]
	}
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
                                           secSel: false});
    this.setState(state1);
  }

  render() {
    let root = this
    function makeColumn(a, i, j) {
     if (a[i][j].revealed) {
        return <div className="column">
          <p>{a[i][j].name}</p>
        </div>;
      } else {
        return <div className="column">
            <button onClick={root.reveal(i, j).bind(root)}>?</button>
        </div>;
        //return <button onClick={this.init.bind(this)}>Click this button!</button>;
        //return <p><button onClick={this.reveal(i, j).bind(this)}>?</button></p>
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
    
    if (this.state.letterMatrix == false) {
        return <button onClick={this.init.bind(this)}>Click this button!</button>;
    } else {
      return <div>{makeRow(this.state.letterMatrix, 0)} 
             {makeRow(this.state.letterMatrix, 1)}
             {makeRow(this.state.letterMatrix, 2)}
             {makeRow(this.state.letterMatrix, 3)}</div>;
    }
  }
}

