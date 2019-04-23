[@react.component]
let make = () => {
  let url = ReasonReactRouter.useUrl();
  let inner =
    switch (url.path) {
    | ["cluster", id] => <Cluster id />
    | _ =>
      ReasonReactRouter.push("/cluster/f0");
      React.null;
    };
  <> <Header /> inner </>;
};
