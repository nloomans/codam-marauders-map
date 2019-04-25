[@react.component]
let make = (~id: Page.cluster) =>
  <div> {React.string("This is cluster " ++ Page.showCluster(id))} </div>;
