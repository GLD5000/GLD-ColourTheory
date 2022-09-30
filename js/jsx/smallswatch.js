"use strict";

class SmallSwatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return       <button onClick={() => this.setState({ liked: false })}>
        <h2>H2</h2>
      Clicked
    </button>
;
    }

    return (
      <button onClick={() => this.setState({ liked: true })}>
        Test
      </button>
    );
  }
}

let domContainer = document.querySelector("#palette");
ReactDOM.render(<SmallSwatch/>, domContainer);
    