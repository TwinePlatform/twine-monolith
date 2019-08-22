import { RibbonPosition } from "./types";

const topLeft = `
  top: 25px;
  left: -50px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
`;

const topRight = `
  top: 25px;
  right: -50px;
  left: auto;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
`;

const bottomLeft = `
  top: auto;
  bottom: 25px;
  left: -50px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
`;

const bottomRight = `
  top: auto;
  right: -50px;
  bottom: 25px;
  left: auto;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
`;

export const getRibbonPosition = (position: RibbonPosition): string  => {
  switch(position) {  
    case 'topRight':
      return topRight;
      
    case 'bottomRight':
      return bottomRight;
        
    case 'bottomLeft':
      return bottomLeft;

    default:
    case 'topLeft':
      return topLeft;
  }
}
