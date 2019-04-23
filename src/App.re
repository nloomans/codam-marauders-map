[@react.component]
let make = () => {
	let url = ReasonReactRouter.useUrl();
	switch url.path {
	| ["cluster", id] => <Cluster id={id} />
	| _ => {
			ReasonReactRouter.push("/cluster/f1");
			React.null
		}
	};
};
