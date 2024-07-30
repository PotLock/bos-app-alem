import { Files, State, state } from "alem";
import CameraIcon from "@app/assets/svgs/CameraIcon";
import Image from "@app/components/mob.near/Image";
import constants from "@app/constants";
import uploadFileUpdateState from "../../utils/uploadFileUpdateState";
import { Container, BackgroundImage, ProfileImage } from "./styles";

const Profile = () => {
  const { IPFS_BASE_URL } = constants;
  const backgroundImage = state.backgroundImage;
  const profileImage = state.profileImage;

  const fallbackImg = "bafkreidsqk5rg6mdcdrfpedadeqejfwlfan75tjrybxu6cnlwzs4qizjdq";

  const handleBgChange = (files: any) => {
    if (files) {
      uploadFileUpdateState(files[0], (res: any) => {
        const ipfs_cid = res.body.cid;
        console.log("PIFS:", ipfs_cid);
        State.update({ backgroundImage: { ipfs_cid } });
      });
    }
  };

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
        <Files
          multiple={false}
          accepts={["image/*"]}
          minFileSize={1}
          className="btn-change-bg"
          style={{
            background: "#fff",
            boxShadow:
              "rgba(0, 0, 0, 0.22) 0px 0px 0px 1px inset, rgba(15, 15, 15, 0.15) 0px -1px 0px 0px inset, rgba(5, 5, 5, 0.08) 0px 1px 2px -0.5px",
            padding: "9px 16px",
            display: "flex",
            gap: 8,
            borderRadius: 6,
            transition: "200ms ease-in-out",
            width: "fit-content",
          }}
          clickable
          onChange={handleBgChange}
        >
          <CameraIcon />
          <span> Add cover photo</span>
        </Files>
      </BackgroundImage>
      <ProfileImage>
        <Image className="profile-image" image={profileImage} fallbackUrl={IPFS_BASE_URL + fallbackImg} />
        <Files
          multiple={false}
          accepts={["image/*"]}
          minFileSize={1}
          className="btn-change-img"
          style={{
            position: "absolute",
            bottom: "0px",
            right: "0px",
            background: "white",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            boxAlign: "center",
            alignItems: "center",
            boxPack: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "none",
            boxShadow:
              "rgba(0, 0, 0, 0.22) 0px 0px 0px 1px inset, rgba(15, 15, 15, 0.15) 0px -1px 0px 0px inset, rgba(5, 5, 5, 0.08) 0px 1px 2px -0.5px",
          }}
          clickable
          onChange={handleImgChange}
        >
          <CameraIcon />
        </Files>
      </ProfileImage>
    </Container>
  );
};

export default Profile;
