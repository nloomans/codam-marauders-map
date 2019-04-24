type cluster =
  | F0
  | F1;

type page =
  | Index
  | Cluster(cluster)
  | Settings
  | NotFound;

let showCluster = (cluster: cluster) =>
  switch (cluster) {
  | F0 => "Floor 0"
  | F1 => "Floor 1"
  };

let showPage = (page: page) =>
  switch (page) {
  | Index => "Index"
  | Cluster(cluster) => showCluster(cluster)
  | Settings => "Settings"
  | NotFound => "404"
  };

let usePage = () => {
  let url = ReasonReactRouter.useUrl();
  switch (url.path) {
  | [] => Index
  | ["cluster", "f0"] => Cluster(F0)
  | ["cluster", "f1"] => Cluster(F1)
  | ["settings"] => Settings
  | _ => NotFound
  };
};
