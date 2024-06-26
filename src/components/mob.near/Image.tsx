/**
 * https://near.org/near/widget/ComponentDetailsPage?src=mob.near/widget/Image
 */
import { State, state } from "alem";
import NftImage from "./NftImage";

const Image = (props: any) => {
  const image = props.image;
  const className = props.className;
  const style = props.style;
  const alt = props.alt;
  const fallbackUrl =
    props.fallbackUrl ?? "https://ipfs.near.social/ipfs/bafkreiccpup6f2kihv7bhlkfi4omttbjpawnsns667gti7jbhqvdnj4vsm";
  const thumbnail = props.thumbnail;

  State.init({
    image,
  });

  if (JSON.stringify(image) !== JSON.stringify(state.image)) {
    State.update({
      image,
      imageUrl: null,
    });
  }

  function toUrl(image: any) {
    return (image.ipfs_cid ? `https://ipfs.near.social/ipfs/${image.ipfs_cid}` : image.url) || fallbackUrl;
  }

  const thumb = (imageUrl: string) =>
    thumbnail && imageUrl && !imageUrl.startsWith("data:image/")
      ? `https://i.near.social/${thumbnail}/${imageUrl}`
      : imageUrl;

  return image.nft.contractId && image.nft.tokenId ? (
    <NftImage
      {...{
        className,
        style,
        alt,
        nft: image.nft,
        thumbnail,
        fallbackUrl,
      }}
    />
  ) : (
    <img
      className={className}
      style={style}
      src={state.imageUrl ? thumb(state.imageUrl) : thumb(toUrl(image))}
      alt={alt}
      onError={() => {
        if (state.imageUrl !== fallbackUrl) {
          State.update({
            imageUrl: fallbackUrl,
          });
        }
      }}
    />
  );
};

export default Image;
