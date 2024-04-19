import { PotDetail } from "@app/types";
import { Card, CardSection, Description, Subtitle, Title } from "./styles";
import { Markdown } from "alem";
import PotSDK from "@app/SDK/pot";
import tagsList from "./tagsList";
import hrefWithParams from "@app/utils/hrefWithParams";
import yoctosToNear from "@app/utils/yoctosToNear";
import yoctosToUsd from "@app/utils/yoctosToUsd";
import Tag from "./Tag/Tag";
import Indicator from "./Indicator/Indicator";

const MAX_DESCRIPTION_LENGTH = 100;
const MAX_TITLE_LENGTH = 36;

type Props = {
  potId: string;
};

const PotCard = ({ potId }: Props) => {
  const potConfig: PotDetail = PotSDK.getConfig(potId);

  if (!potConfig)
    return (
      <Card style={{ justifyContent: "center", alignItems: "center" }}>
        {potConfig == null ? (
          <div className="spinner-border text-secondary" role="status" />
        ) : (
          <div>Pot {potId} not found.</div>
        )}
      </Card>
    );

  const { pot_name, pot_description, matching_pool_balance } = potConfig;

  const amountNear = yoctosToNear(matching_pool_balance, true);
  const amountUsd = yoctosToUsd(matching_pool_balance);

  const description = !pot_description
    ? "No description"
    : pot_description.length > MAX_DESCRIPTION_LENGTH
    ? `${pot_description.slice(0, MAX_DESCRIPTION_LENGTH)}...`
    : pot_description;

  const title = !pot_name
    ? "No title"
    : pot_name.length > MAX_TITLE_LENGTH
    ? `${pot_name.slice(0, MAX_TITLE_LENGTH)}...`
    : pot_name;

  const tags = tagsList(potConfig);

  return (
    <Card href={hrefWithParams(`?tab=pot&potId=${potId}`)}>
      <CardSection>
        <Title>{title}</Title>
        <Description>
          <Markdown text={description} />
        </Description>
      </CardSection>
      <CardSection
        style={{
          background: "#F6F5F3",
          borderTop: "1px #7B7B7B solid",
          marginTop: "auto",
          height: "fit-content",
        }}
      >
        <Title>
          <div>
            {amountNear}
            {amountUsd && <span className="usd-amount">{amountUsd}</span>}
            <span className="text">in pot</span>
          </div>
        </Title>
        {tags.map((tag) =>
          tag.visibility ? (
            <Tag {...tag} preElements={<Indicator {...(tag.preElementsProps || {})} />} key={tag.text} />
          ) : (
            ""
          ),
        )}
      </CardSection>
    </Card>
  );
};

export default PotCard;
