export const copyResultToClipboard = (result: {
  map: string;
  player1: { civilization: string; color: string };
  player2: { civilization: string; color: string };
}): void => {
  const text = `🏆 AoE IV Roulette Result

🗺 Map: ${result.map}

🔵 Player 1
${result.player1.civilization}

🔴 Player 2
${result.player2.civilization}`;

  navigator.clipboard.writeText(text);
};
