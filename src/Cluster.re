[@react.component]
let make = (~id: string) => {
	<div>{React.string("This is cluster " ++ id)}</div>
};
