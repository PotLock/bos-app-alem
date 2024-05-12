// import { useState } from "alem";
// import { Container, SelectContainer, Trigger, Value, Placeholder, Label, Menu } from "./styles";

// type Props = {
//   label?: string;
//   noLabel?: boolean;
//   placeholder?: string;
//   value?: any;
//   options?: any[];
//   onChange?: (value: any) => void;
//   validate?: () => void;
//   error?: string;
//   containerStyles?: React.CSSProperties;
//   inputStyles?: React.CSSProperties;
//   iconLeft?: any;
// };

// // const Select = ({label, noLabel, placeholder, value, options, onChange, validate, error}: Props) => {
// const Select = (componentProps: Props) => {
//   const [active, setActive] = useState(false);

//   const label = componentProps.label ?? "Label";
//   const noLabel = componentProps.noLabel ?? false;
//   const placeholder = componentProps.placeholder ?? "Select an option";
//   const value = componentProps.value ?? "";
//   const options = componentProps.options ?? [];
//   const onChange = componentProps.onChange ?? (() => {});
//   const validate = componentProps.validate ?? (() => {});
//   const error = componentProps.error ?? "";

//   return (
//     <Container>
//       {label && !noLabel && <Label>{label}</Label>}
//       <SelectContainer>
//         <Trigger style={componentProps.inputStyles || {}} onClick={() => setActive(!active)}>
//           {value ? (
//             <Value>
//               {componentProps.iconLeft && componentProps.iconLeft}
//               {value.text}
//             </Value>
//           ) : (
//             <Placeholder>{placeholder}</Placeholder>
//           )}
//           <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path
//               d="M5.00003 2.83L8.17003 6L9.58003 4.59L5.00003 0L0.410034 4.59L1.83003 6L5.00003 2.83ZM5.00003 15.17L1.83003 12L0.420034 13.41L5.00003 18L9.59003 13.41L8.17003 12L5.00003 15.17Z"
//               fill="#A6A6A6"
//             />
//           </svg>
//         </Trigger>
//         <Menu className={active ? "active" : ""}>
//           {options.map((item) => (
//             <div
//               className="item"
//               onClick={() => {
//                 onChange(item);
//                 setActive(false);
//               }}
//             >
//               {item.text}
//             </div>
//           ))}
//         </Menu>
//       </SelectContainer>
//     </Container>
//   );
// };

// export default Select;

// import styled from "styled-components";

// export const Container = styled.div`
//   display: flex;
//   height: 100%;
//   flex-direction: column;
//   gap: 8px;
//   flex-direction: column;
//   font-size: 14px;
// `;

// export const Label = styled.div`
//   font-weight: 500;
// `;

// export const SelectContainer = styled.div`
//   position: relative;
//   display: flex;
//   height: 100%;
// `;

// export const Trigger = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 10px 16px;
//   gap: 10px;
//   cursor: pointer;
// `;

// export const Placeholder = styled.div`
//   color: #7b7b7b;
//   line-height: 142%;
// `;
// export const Value = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 4px;
//   font-weight: 500;
//   svg,
//   img {
//     width: 15px;
//   }
// `;

// export const TriggerControl = styled.input`
//   position: absolute;
//   padding: 0;
//   width: 100%;
//   height: 100%;
//   opacity: 0;
// `;

// export const Menu = styled.div`
//   position: absolute;
//   display: flex;
//   flex-direction: column;
//   top: 110%;
//   left: 0;
//   max-height: 0;
//   opacity: 0;
//   overflow: hidden;
//   pointer-events: none;
//   border-radius: 6px;
//   box-shadow: 0px 0px 0px 1px rgba(55, 55, 55, 0.04), 0px 14px 20px -6px rgba(15, 15, 15, 0.15),
//     0px 5px 20px -2px rgba(5, 5, 5, 0.08);
//   transition: all 300ms ease-in-out;
//   min-width: 100%;
//   .item {
//     padding: 0.5rem;
//     background: white;
//     transition: all 300ms ease-in-out;
//     cursor: pointer;
//     &:hover {
//       background: #292929;
//       color: white;
//     }
//   }
//   &.active {
//     max-height: fit-content;
//     opacity: 1;
//     pointer-events: all;
//   }
// `;
