Begin Watch:

sass --watch css/sass/main.scss:css/style.css

Single Compile:

sass css/sass/main.scss:css/style.css


random sass function??
@for $i from 1 through 9 {
    .grid__item[data-grid=# {"'i"+ $i + "'"}] {
      grid-area: unquote("i" + $i);
    }
  }
