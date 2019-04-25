open Page;

let allTabs = [Cluster(F0), Cluster(F1), Settings];

let indexOf = (needle: 'a, haystack: list('a)) =>
  haystack
  |> List.mapi((index, tab) => (index, tab))
  |> List.find(((_, tab)) => tab == needle)
  |> fst;

[@react.component]
let make = (~page: page) => {
  let tabs = allTabs |> List.map(tab => <Tab page=tab />);

  let selectedTabIndex =
    if (allTabs |> List.exists(tab => tab == page)) {
      indexOf(page, allTabs);
    } else {
      (-1); // Don't underline anything
    };

  <MaterialUi.AppBar position=`Static>
    <MaterialUi.Tabs value=selectedTabIndex>
      {ReasonReact.array(Array.of_list(tabs))}
    </MaterialUi.Tabs>
  </MaterialUi.AppBar>;
};
