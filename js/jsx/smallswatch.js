"use strict";

class SmallSwatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return <h1>"Clicked"</h1>;
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
    