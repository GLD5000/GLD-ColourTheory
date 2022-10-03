"use strict";

class SmallSwatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return (
        <button onClick={() => this.setState({ liked: false })}>
          <h2>H2</h2>
          Clicked
        </button>
      );
    }

    return <Element />;
  }
}

let domContainer = document.querySelector("#palette");
ReactDOM.render(<SmallSwatch />, domContainer);

function Element() {
  return (
    <div className="swatch bonochromeA" id="bonochromeA">
      <div
        id="bonochromeA-wrapper"
        className="picker-wrapper bonochromeA-wrapper"
        name="Bonochrome A"
      >
        <input
          type="color"
          id="bonochromeA-picker"
          className="picker bonochromeA-picker"
        ></input>
        <div className="close-wrapper">
          <button
            id="bonochromeA-close"
            className="close-btn"
            aria-label="Close Swatch"
          >
            <svg id="close-svg" alt="Close" height="100%" width="100%">
              <rect
                className="background"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                rx="4%"
                style={{ strokeWidth: "0", fill: "white" }}
              />
              <line
                x1="10%"
                y1="10%"
                x2="90%"
                y2="90%"
                style={{
                  stroke: "rgb(0,0,0)",
                  strokeWidth: "10%",
                  strokeLinecap: "round",
                }}
              />
              <line
                x1="10%"
                y1="90%"
                x2="90%"
                y2="10%"
                style={{
                  stroke: "rgb(0,0,0)",
                  strokeWidth: "10%",
                  strokeLinecap: "round",
                }}
              />
            </svg>
          </button>
        </div>

        <div className="name-label-container">
          <button
            id="bonochromeA-custom"
            className="bonochromeA-name swatch-name btn-picker"
          >
            BonochromeA
          </button>
          <button
            className="icon-copybtn icon-copybtn-sml"
            id="bonochromeA-copybtn"
          >
            <div
              className="bonochromeA-svg-wrapper svg-wrapper-sml"
              id="bonochromeA-copybtn-svg-wrapper"
            >
              <svg
                className="copy-svg svg-icon svg icon-copybtn-svg"
                alt="Copy Colours"
                height="100%"
                width="100%"
              >
                <use href="#copy-svg" />
              </svg>
            </div>
            <h2 className="icon-copybtn-text" id="bonochromeA-copybtn-text">
              Copy
            </h2>
          </button>
        </div>

        <label id="bonochromeA-info" className="swatch-info">
          Information
        </label>
      </div>
    </div>
  );
}
