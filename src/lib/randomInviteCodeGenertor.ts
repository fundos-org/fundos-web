export const getRandomCode = () =>
  [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].sort(() => 0.5 - Math.random()).slice(0, 4).join('') +
  [...Array(4)].map(() => Math.floor(Math.random() * 10)).join('');
