import { useEffect, useParams, useState } from "alem";
import styled from "styled-components";
import { getConfig } from "@app/services/getPotData";
import { PotDetail } from "@app/types";
import TimeLeft from "../TimeLeft";
import ProgressBar from "./ProgressBar";
import statsList from "./statsList";
import { Loader, State, Wrapper } from "./styles";

const HeaderStatus = () => {
  const { potId } = useParams();
  const [mobileMenuActive, setMobileMenuActive] = useState(false);

  const [potDetail, setPotDetail] = useState<null | PotDetail>(null);

  useEffect(() => {
    if (!potDetail) getConfig({ potId, updateState: setPotDetail });
  }, []);

  if (potDetail === null) return "";

  const stats = statsList(potDetail);

  const getIndexOfActive = () => {
    let index = 0;
    stats.forEach((state, idx) => {
      if (state.started && !state.completed) {
        index = idx;
      }
    });
    if (index === null) return 3;
    return index;
  };

  const containerHeight = 181;
  const showActiveState = getIndexOfActive() * (containerHeight / 4);

  const Container = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    transition: all 300ms ease-in-out;
    .mobile-selected {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin: 1rem 0;
      transition: all 300ms ease-in-out;
    }
    @media only screen and (max-width: 1100px) {
      justify-content: left;
      height: ${containerHeight / 4}px;
      overflow: hidden;
      .mobile-selected {
        margin: 10px 0;
        transform: translateY(${-showActiveState}px);
        flex-direction: column;
      }
    }
  `;

  return (
    <Wrapper onClick={() => setMobileMenuActive(!mobileMenuActive)}>
      <Container
        style={
          mobileMenuActive
            ? {
                height: containerHeight + "px",
              }
            : {}
        }
      >
        <div
          className="mobile-selected"
          style={
            mobileMenuActive
              ? {
                  transform: "translateY(0px)",
                }
              : {}
          }
        >
          {stats.map(({ label, daysLeft, progress, started, completed }, idx) => {
            return (
              <State
                style={{
                  color: completed || started ? "#000" : "#7b7b7b",
                }}
                key={label}
              >
                <ProgressBar progress={progress} started={started} completed={completed} />
                <div>
                  {label}
                  {!daysLeft && started && <span>pending </span>}
                  {started && !completed && daysLeft && (
                    <span>
                      ends in
                      <TimeLeft daysLeft={daysLeft} />
                    </span>
                  )}
                  {idx === 0 && !started && " hasn’t started"}
                </div>

                <Loader
                  style={{
                    background: completed ? "#629D13" : "#dbdbdb",
                    display: idx === 3 ? "none" : "flex",
                  }}
                />
              </State>
            );
          })}
        </div>
      </Container>
      <svg
        className="spread-indicator"
        style={{
          rotate: mobileMenuActive ? "180deg" : "0deg",
        }}
        viewBox="0 0 12 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.59 0.294922L6 4.87492L1.41 0.294922L0 1.70492L6 7.70492L12 1.70492L10.59 0.294922Z"
          fill="#7B7B7B"
        />
      </svg>
    </Wrapper>
  );
};

export default HeaderStatus;
