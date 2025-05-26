export const getRandomLightColor = (saturation = '75%'): string => 
  `hsl(${Math.floor(Math.random() * 360)}, 100%, ${saturation})`