import styled from "styled-components";

export const Container = styled.a`
  --Primary-50: #fef3f2;
  --primary-400: #f6767a;
  --Primary-600: #dd3345;
  --Peach-50: #fef6ee;
  --Neutral-700: #525252;
  --Neutral-800: #464646;
  /* General */
  display: flex;
  font-size: 14px;
  line-height: 157%;
  align-items: center;
  justify-content: center;
  color: #292929;
  padding: 9px 16px;
  gap: 8px;
  font-weight: 500;
  border-radius: 6px;
  text-decoration: none;
  cursor: pointer;
  transition: all 200ms ease-in-out;
  border: none;
  outline: 0;
  &:hover {
    text-decoration: none;
  }
  &:focus {
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.84) inset, 0px 1px 1px 1px rgba(166, 166, 166, 0.3) inset,
      0px 0px 0px 2px rgba(166, 166, 166, 0.3) inset, 0px 0px 0px 2px #fff, 0px 0px 0px 4px rgba(0, 0, 0, 0.84) !important;
  }
  &.disabled {
    pointer-events: none;
  }

  /* Brand Button */
  &.brand.filled {
    color: white;
    background: var(--Primary-600);
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.84) inset, 0px 1px 1px 1px rgba(246, 118, 122, 0.5) inset,
      0px 0px 0px 2px rgba(246, 118, 122, 0.5) inset, 0px 1.5px 0px 0px rgba(0, 0, 0, 0.84);
    transform: translateY(-1.5px);
    &:hover {
      box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.84) inset, 0px 1px 1px 1px rgba(246, 118, 122, 0.5) inset,
        0px 0px 0px 2px rgba(246, 118, 122, 0.5) inset;
      transform: translateY(0);
    }
  }
  &.brand.tonal {
    background: var(--Peach-50);
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.84) inset, 0px 1px 1px 1px #fff inset, 0px 0px 0px 2px #fff inset,
      0px 1.5px 0px 0px rgba(0, 0, 0, 0.84);
    transform: translateY(-1.5px);
    &:hover {
      box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.84) inset, 0px 1px 1px 1px #fff inset,
        0px 0px 0px 2px rgba(255, 255, 255, 0.8) inset;
      transform: translateY(0);
    }
  }

  &.brand.Plain {
    color: var(--Primary-600);
    &:hover {
      color: var(--Primary-400);
    }
  }

  &.brand.outline {
    color: var(--Primary-600);
    background: rgba(255, 255, 255, 0.01);
    box-shadow: 0px 0px 0px 1px rgba(243, 78, 95, 0.78) inset, 0px -1px 0px 0px rgba(73, 8, 19, 0.5) inset,
      0px 1px 2px -0.5px rgba(73, 8, 19, 0.2);
    &:hover {
      background: #fef3f2;
    }
  }
  /* Standard Button */
  &.standard.filled {
    background: var(--Neutral-800);
    color: white;
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.84) inset, 0px 1px 1px 1px rgba(166, 166, 166, 0.4) inset,
      0px 0px 0px 2px rgba(166, 166, 166, 0.4) inset, 0px 1px 2px 0px rgba(15, 15, 15, 0.15),
      0px 1px 3px -1px rgba(5, 5, 5, 0.08);
    &:hover {
      background: var(--Neutral-700);
    }
  }

  &.standard.outline {
    background: #fff;
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.22) inset, 0px -1px 0px 0px rgba(15, 15, 15, 0.15) inset,
      0px 1px 2px -0.5px rgba(5, 5, 5, 0.08);
    &:hover {
      background: var(--Neutral-50);
    }
  }

  &.standard.plain {
  }

  /* Disabled Button */
  &.filled.disabled {
    color: #a6a6a6;
    background: var(--Neutral-100, #ebebeb);
    box-shadow: 0px 0px 0px 1px rgba(15, 15, 15, 0.15) inset;
  }
  &.outline.disabled {
    color: #c7c7c7;
    background: var(--Neutral-White, #fff);
    box-shadow: 0px 0px 0px 1px rgba(15, 15, 15, 0.15) inset;
  }
`;

export const Icon = styled.img`
  width: 16px;
`;
