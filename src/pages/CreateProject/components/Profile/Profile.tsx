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
