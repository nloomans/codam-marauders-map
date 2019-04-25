open Page;

[@react.component]
let make = (~page: page) =>
  <MaterialUi.Tab label={React.string(showPage(page))} />;
