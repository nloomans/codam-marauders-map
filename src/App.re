open Page;

[@react.component]
let make = () => {
  let page = usePage();
  <>
    <Header page />
    {switch (page) {
     | Index =>
       ReasonReactRouter.replace("/cluster/f0");
       React.null;
     | Cluster(id) => <Cluster id />
     | Settings => <Settings />
     | NotFound => <NotFound />
     }}
  </>;
};
