open Types;

let allTabs = [Cluster(F0), Cluster(F1), Settings];

let useTab = () => {
  let url = ReasonReactRouter.useUrl();
  switch (url.path) {
  | ["cluster", "f0"] => Some(Cluster(F0))
  | ["cluster", "f1"] => Some(Cluster(F1))
  | ["settings"] => Some(Settings)
  | _ => None
  };
};

let indexOf = (needle: 'a, haystack: list('a)) =>
  haystack
  |> List.mapi((index, tab) => (index, tab))
  |> List.find(((_, tab)) => tab == needle)
  |> fst;

[@react.component]
let make = () => {
  let tab = useTab();
  let tabs = allTabs |> List.map(tab => <Tab tab />);

  let selected =
    switch (tab) {
    | Some(tab) => indexOf(tab, allTabs)
    | None => (-1) // MaterialUi.Tabs ignores invalid values
    };

  <MaterialUi.AppBar>
    <MaterialUi.Tabs value=selected>
      {ReasonReact.array(Array.of_list(tabs))}
    </MaterialUi.Tabs>
  </MaterialUi.AppBar>;
};
