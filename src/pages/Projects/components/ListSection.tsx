import { props, useMemo } from "alem";
import styled from "styled-components";
import Feed from "@app/components/devs.near/Feed";

type BreakPoint = {
  breakpoint: number;
  items: number;
};

type Props = {
  shouldShuffle?: boolean;
  renderItem: any;
  items: any[];
  maxCols?: number;
  responsive?: BreakPoint[];
};

const ListSection = ({ shouldShuffle, items, renderItem }: Props) => {
  const responsive = props.responsive || [];

  // if (!Feed) {
  //   return <p>Loading...</p>;
  // }

  const _items = useMemo(() => {
    if (shouldShuffle) {
      return [...items].sort(() => Math.random() - 0.5);
    }
    return items;
  }, [items, shouldShuffle]);

  const PAGE_SIZE = 9;

  const Grid = styled.div`
    display: grid;
    width: 100%;
    padding-top: 20px;
    padding-bottom: 32px;

    gap: 31px;

    /* For mobile devices (1 column) */
    @media screen and (max-width: 739px) {
      grid-template-columns: repeat(1, 1fr);
      ${props.tab !== "pot" && "padding-top: 40px;"}
    }

    /* For tablet devices (2 columns) */
    @media screen and (min-width: 740px) and (max-width: 1023px) {
      grid-template-columns: repeat(2, 1fr);
    }

    /* For desktop devices (3 columns) */
    @media screen and (min-width: 1024px) {
      grid-template-columns: repeat(${!props.maxCols || props.maxCols > 2 ? "3" : "2"}, 1fr);
    }
    ${responsive.map(
      (view: any) =>
        `
    @media screen and (max-width: ${view.breakpoint}px) {
      grid-template-columns: repeat(${view.items}, 1fr);
    }
    `,
    )}
  `;

  return <Feed items={_items} Item={renderItem} Layout={Grid} perPage={PAGE_SIZE} />;
};

export default ListSection;
