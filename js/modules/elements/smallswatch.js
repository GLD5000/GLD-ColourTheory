"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SmallSwatch = function (_React$Component) {
  _inherits(SmallSwatch, _React$Component);

  function SmallSwatch(props) {
    _classCallCheck(this, SmallSwatch);

    var _this = _possibleConstructorReturn(this, (SmallSwatch.__proto__ || Object.getPrototypeOf(SmallSwatch)).call(this, props));

    _this.state = { liked: false };
    return _this;
  }

  _createClass(SmallSwatch, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      if (this.state.liked) {
        return React.createElement(
          "button",
          { onClick: function onClick() {
              return _this2.setState({ liked: false });
            } },
          React.createElement(
            "h2",
            null,
            "H2"
          ),
          "Clicked"
        );
      }

      return React.createElement(Element, null);
    }
  }]);

  return SmallSwatch;
}(React.Component);

var domContainer = document.querySelector("#palette");
ReactDOM.render(React.createElement(SmallSwatch, null), domContainer);

function Element() {
  return React.createElement(
    "div",
    { className: "swatch bonochromeA", id: "bonochromeA" },
    React.createElement(
      "div",
      {
        id: "bonochromeA-wrapper",
        className: "picker-wrapper bonochromeA-wrapper",
        name: "Bonochrome A"
      },
      React.createElement("input", {
        type: "color",
        id: "bonochromeA-picker",
        className: "picker bonochromeA-picker"
      }),
      React.createElement(
        "div",
        { className: "close-wrapper" },
        React.createElement(
          "button",
          {
            id: "bonochromeA-close",
            className: "close-btn",
            "aria-label": "Close Swatch"
          },
          React.createElement(
            "svg",
            { id: "close-svg", alt: "Close", height: "100%", width: "100%" },
            React.createElement("rect", {
              className: "background",
              x: "0%",
              y: "0%",
              width: "100%",
              height: "100%",
              rx: "4%",
              style: { strokeWidth: "0", fill: "white" }
            }),
            React.createElement("line", {
              x1: "10%",
              y1: "10%",
              x2: "90%",
              y2: "90%",
              style: {
                stroke: "rgb(0,0,0)",
                strokeWidth: "10%",
                strokeLinecap: "round"
              }
            }),
            React.createElement("line", {
              x1: "10%",
              y1: "90%",
              x2: "90%",
              y2: "10%",
              style: {
                stroke: "rgb(0,0,0)",
                strokeWidth: "10%",
                strokeLinecap: "round"
              }
            })
          )
        )
      ),
      React.createElement(
        "div",
        { className: "name-label-container" },
        React.createElement(
          "button",
          {
            id: "bonochromeA-custom",
            className: "bonochromeA-name swatch-name btn-picker"
          },
          "BonochromeA"
        ),
        React.createElement(
          "button",
          {
            className: "icon-copybtn icon-copybtn-sml",
            id: "bonochromeA-copybtn"
          },
          React.createElement(
            "div",
            {
              className: "bonochromeA-svg-wrapper svg-wrapper-sml",
              id: "bonochromeA-copybtn-svg-wrapper"
            },
            React.createElement(
              "svg",
              {
                className: "copy-svg svg-icon svg icon-copybtn-svg",
                alt: "Copy Colours",
                height: "100%",
                width: "100%"
              },
              React.createElement("use", { href: "#copy-svg" })
            )
          ),
          React.createElement(
            "h2",
            { className: "icon-copybtn-text", id: "bonochromeA-copybtn-text" },
            "Copy"
          )
        )
      ),
      React.createElement(
        "label",
        { id: "bonochromeA-info", className: "swatch-info" },
        "Information"
      )
    )
  );
}