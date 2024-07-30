import { Files, State, state } from "alem";
import CameraIcon from "@app/assets/svgs/CameraIcon";
import Button from "@app/components/Button";
import Image from "@app/components/mob.near/Image";
import constants from "@app/constants";
import uploadFileUpdateState from "../../utils/uploadFileUpdateState";
import { Container, BackgroundImage, ProfileImage, FileLabel } from "./styles";

const Profile = () => {
  const { IPFS_BASE_URL } = constants;
  const backgroundImage = state.backgroundImage;
  const profileImage = state.profileImage;

  const fallbackImg = "bafkreidsqk5rg6mdcdrfpedadeqejfwlfan75tjrybxu6cnlwzs4qizjdq";

  const handleBgChange = (files: any) => {
    console.log("Files:", files);

    if (files) {
      uploadFileUpdateState(files[0], (res: any) => {
        const ipfs_cid = res.body.cid;
        console.log("PIFS:", ipfs_cid);
        State.update({ backgroundImage: { ipfs_cid } });
      });
    }
  };

  // const handleBgChange = (files: any) => {
  //   console.log("Files:", files);

  //   if (files) {
  //     // uploadFileUpdateState(files[0], (res: any) => {
  //     //   const ipfs_cid = res.body.cid;
  //     //   console.log("PIFS:", ipfs_cid);
  //     //   State.update({ backgroundImage: { ipfs_cid } });
  //     // });
  //   }
  // };

  const handleImgChange = (files: any) => {
    if (files) {
      uploadFileUpdateState(files[0], (res: any) => {
        const ipfs_cid = res.body.cid;
        State.update({ profileImage: { ipfs_cid } });
      });
    }
  };

  return (
    <Container>
      <BackgroundImage>
        <Image image={backgroundImage} alt="profile background" fallbackUrl={IPFS_BASE_URL + fallbackImg} />
        <Button type="standard" varient="outline" customClassName="btn-change-bg">
          <CameraIcon />
          <span> Add cover photo</span>
          <Files
            multiple={false}
            accepts={["image/*"]}
            minFileSize={1}
            style={{
              // zIndex: 1,
              top: 0,
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
            clickable
            onChange={handleBgChange}
          />
        </Button>
        <Files
          multiple={false}
          accepts={["image/*"]}
          minFileSize={1}
          className="btn btn-outline-primary"
          style={{
            top: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
          clickable
          onChange={handleBgChange}
        >
          Upload BG Test
        </Files>
      </BackgroundImage>
      <ProfileImage>
        <Image className="profile-image" image={profileImage} fallbackUrl={IPFS_BASE_URL + fallbackImg} />
        <button className="btn-change-img">
          <CameraIcon />
          <Files
            multiple={false}
            accepts={["image/*"]}
            minFileSize={1}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 1,
              left: 0,
              top: 0,
            }}
            clickable
            onChange={handleImgChange}
          ></Files>
        </button>
      </ProfileImage>
    </Container>
  );
};

export default Profile;
