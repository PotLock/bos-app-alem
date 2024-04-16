import { Widget } from "alem";

const Post = (postProps: any) => {
  return (
    <Widget
      loading={<div className="w-100" style={{ height: "200px" }} />}
      src="mob.near/widget/MainPage.N.Post"
      props={postProps}
    />
  );
};

export default Post;
