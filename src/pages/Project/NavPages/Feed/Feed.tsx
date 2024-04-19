import { Widget } from "alem";
import styled from "styled-components";
import Post from "./Post";
import Compose from "../../../Profile/components/Compose";
import MergedIndexFeed from "../../../Profile/components/MergedIndexFeed/MergedIndexFeed";

type Props = {
  groupId: string;
  permissions: string[];
  post?: any;
  hashtags?: string[];
  indexKey?: string;
  accounts: string[];
  isPremiumFeed?: boolean;
  commentAccounts?: string;
  filter?: any;
};

const Feed = (compProps: Props) => {
  const post = compProps.post === undefined ?? true;
  const hashtags = compProps.hashtags || [];

  const indexKey = compProps.indexKey ?? "main";

  const index = [
    {
      action: "post",
      key: indexKey,
      options: {
        limit: 10,
        order: "desc",
        accountId: compProps.accounts,
      },
      cacheOptions: {
        ignoreCache: true,
      },
    },
    {
      action: "repost",
      key: indexKey,
      options: {
        limit: 10,
        order: "desc",
        accountId: compProps.accounts,
      },
      cacheOptions: {
        ignoreCache: true,
      },
    },
  ];

  const isPremiumFeed = compProps.isPremiumFeed;
  const commentAccounts = compProps.commentAccounts;
  const renderedPosts = {};

  const makePostItem = (a: any) => ({
    type: "social",
    path: `${a.accountId}/post/main`,
    blockHeight: a.blockHeight,
  });

  const renderPost = (a: any) => {
    if (a.value.type !== "md") {
      return false;
    }
    const item = JSON.stringify(makePostItem(a));
    if (item in renderedPosts) {
      return false;
    }
    renderedPosts[item] = true;

    const postProps = {
      accountId: a.accountId,
      blockHeight: a.blockHeight,
      isPremiumFeed,
      commentAccounts,
      indexKey,
      groupId: compProps.groupId,
      permissions: compProps.permissions,
    };

    return (
      <div key={JSON.stringify(a)}>
        <Post {...postProps} />
      </div>
    );
  };

  const repostSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 2 24 24"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path
        fill-rule="evenodd"
        d="M4.854 1.146a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L4 2.707V12.5A2.5 2.5 0 0 0 6.5 15h8a.5.5 0 0 0 0-1h-8A1.5 1.5 0 0 1 5 12.5V2.707l3.146 3.147a.5.5 0 1 0 .708-.708l-4-4z"
        transform="rotate(180, 12, 12), translate(0, 4)"
      />
      <path
        fill-rule="evenodd"
        d="M4.854 1.146a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L4 2.707V12.5A2.5 2.5 0 0 0 6.5 15h8a.5.5 0 0 0 0-1h-8A1.5 1.5 0 0 1 5 12.5V2.707l3.146 3.147a.5.5 0 1 0 .708-.708l-4-4z"
        transform="translate(0, 4)"
      />
    </svg>
  );

  const extractParentPost = (item: any) => {
    if (!item || item.type !== "social" || !item.path || !item.blockHeight) {
      return undefined;
    }
    const accountId = item.path.split("/")[0];
    const parentPost = { accountId, blockHeight: item.blockHeight };
    return `${accountId}/post/main` === item.path ? parentPost : undefined;
  };

  const renderRepost = (a: any) => {
    if (a.value.type !== "repost") {
      return false;
    }
    const post = extractParentPost(a.value.item);
    if (!post) {
      return false;
    }
    const item = JSON.stringify(makePostItem(post));
    if (item in renderedPosts) {
      return false;
    }
    renderedPosts[item] = true;

    const profileLineProps = {
      accountId: a.accountId,
      hideImage: true,
      hideAccountId: true,
      tooltip: true,
    };

    const postProps = {
      accountId: post.accountId,
      blockHeight: post.blockHeight,
      reposted: true,
      isPremiumFeed,
      commentAccounts,
      indexKey,
      groupId: compProps.groupId,
      permissions: compProps.permissions,
    };

    const postLoading = <div className="w-100" style={{ height: "200px" }} />;

    return (
      <div key={JSON.stringify(a)}>
        <div
          className="text-muted"
          style={{
            fontSize: "13px",
            fontWeight: 700,
            marginLeft: "24px",
            marginBottom: "-24px",
            paddingTop: "4px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {repostSvg}{" "}
          <span style={{ marginLeft: "8px" }}>
            Reposted by <Widget loading={a.accountId} src="mob.near/widget/N.ProfileLine" />
          </span>
        </div>
        <Widget loading={postLoading} src="mob.near/widget/MainPage.N.Post" props={postProps} />
      </div>
    );
  };

  const renderItem = (item: any) => {
    return item.action === "post" ? renderPost(item) : renderRepost(item);
  };

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    .post-btn {
      background: rgb(46, 46, 46);
      border-radius: 6px;
      padding: 12px 16px;
      border: none;
      color: white;
    }
  `;

  return (
    <Container>
      {post && <Compose />}

      <MergedIndexFeed index={index} renderItem={renderItem} filter={compProps.filter} threshold={800} />
    </Container>
  );
};

export default Feed;
