import { OverlayTrigger, Tooltip, context, useParams, useState } from "alem";
import PotSDK from "@app/SDK/pot";
import ProfileImage from "@app/components/mob.near/ProfileImage";
import { PotDetail } from "@app/types";
import _address from "@app/utils/_address";
import hrefWithParams from "@app/utils/hrefWithParams";
import ConfigForm from "../ConfigForm/ConfigForm";
import getFields from "./getFields";
import { Admins, AdminsWrapper, Container, Detail, PrviewContainer, Title } from "./styles";

const Settings = ({ potDetail }: { potDetail: PotDetail }) => {
  const { owner, admins } = potDetail;

  const { potId } = useParams();
  const [editSettings, setEditSettings] = useState(false);
  const userIsAdminOrGreater = PotSDK.isUserPotAdminOrGreater(potId, context.accountId);

  const fields = getFields(potId, potDetail);

  const AdminsTooltip = () => (
    <AdminsWrapper>
      <div className="tip-icon">
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 5.24537e-07L-2.54292e-07 8L12 8L6 5.24537e-07Z" fill="white" />
        </svg>
      </div>
      <div className="list">
        {admins.slice(0, admins.length).map((admin) => (
          <a href={hrefWithParams(`?tab=profile&accountId=${admin}`)} target="_blank">
            <ProfileImage style={{}} className="profile-image" accountId={admin} />
            <div>{admin}</div>
          </a>
        ))}
      </div>
    </AdminsWrapper>
  );

  return editSettings ? (
    <Container>
      <Title>Edit Pot settings</Title>
      <ConfigForm potDetail={potDetail} />
    </Container>
  ) : (
    <PrviewContainer>
      <Admins>
        <div className="owner">
          <div>Owner</div>
          <div className="address">
            <ProfileImage style={{}} className="profile-image" accountId={owner} />
            <div>{_address(owner, 15)}</div>
          </div>
        </div>
        {admins.length > 0 && (
          <div className="admins">
            <div>Admins</div>
            <div className="avaters">
              {admins.slice(0, 4).map((admin, idx) => (
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id={`tooltip-${idx}`}>{admin}</Tooltip>}
                  key={admin}
                >
                  <a href={hrefWithParams(`?tab=profile&accountId=${admin}`)} target="_blank">
                    <ProfileImage style={{}} className="profile-image" accountId={admin} />
                  </a>
                </OverlayTrigger>
              ))}
              {admins.length > 4 && (
                <div className="icons-tolltip">
                  +{admins.length - 4}
                  <AdminsTooltip />
                </div>
              )}
            </div>
          </div>
        )}
        {userIsAdminOrGreater && (
          <div className="edit" onClick={() => setEditSettings(true)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0.25 13.7501H3.0625L11.3575 5.45508L8.545 2.64258L0.25 10.9376V13.7501ZM1.75 11.5601L8.545 4.76508L9.235 5.45508L2.44 12.2501H1.75V11.5601Z"
                fill="#DD3345"
              />
              <path
                d="M11.7777 0.469375C11.4852 0.176875 11.0127 0.176875 10.7202 0.469375L9.34766 1.84187L12.1602 4.65438L13.5327 3.28187C13.8252 2.98937 13.8252 2.51688 13.5327 2.22438L11.7777 0.469375Z"
                fill="#DD3345"
              />
            </svg>
            Edit Pot
          </div>
        )}
      </Admins>
      <Detail>
        {fields.map((field) => (
          <div className="row-field" key={field.label}>
            <div className="label">{field.label}</div>
            <div className="input">{field.val ?? "-"}</div>
          </div>
        ))}
      </Detail>
    </PrviewContainer>
  );
};

export default Settings;
