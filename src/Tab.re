open Types;

let showCluster = (cluster: cluster) =>
  switch (cluster) {
  | F0 => "Floor 0"
  | F1 => "Floor 1"
  };

let showTab = (tab: tabs) =>
  switch (tab) {
  | Cluster(cluster) => showCluster(cluster)
  | Settings => "Settings"
  };

[@react.component]
let make = (~tab: tabs) => {
  <MaterialUi.Tab label={React.string(showTab(tab))} />;
};
