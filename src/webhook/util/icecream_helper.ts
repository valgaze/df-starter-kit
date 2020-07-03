/**
 *
 * Config for ice-cream menu
 * This could from an external API or business logic system etc
 */

export const responsesTemplates = [
  `You've had $[count] $[flavor]s this session`,
  `That is $[flavor] ice cream #$[count]!`,
  `There you go, here's a $[flavor] ice cream number $[count]`,
];
export const congratsTemplates = [
  `Just so you know, you're one of our TOP customers. Here's breakdown of your ice-creams`,
  `We're pleased to announce enhanced ice cream analytics services`,
  `You've had a LOT of our ice cream, here's how much`,
];
export const menu = {
  tax: "8.75",
  flavors: {
    strawberry: {
      price: "1.25",
    },
    vanilla: {
      price: "2.35",
    },
    chocolate: {
      price: "3.55",
    },
    mint: {
      price: "4.65",
    },
    broccoli: {
      price: "0.15",
    },
  },
  size: {},
};

export const icecreamHash = {
  chocolate:
    "https://github.com/valgaze/df-cheat-docs/blob/master/icecream/chocolate.jpg?raw=true",
  vanilla:
    "https://github.com/valgaze/df-cheat-docs/blob/master/icecream/vanilla.jpg?raw=true",
  strawberry:
    "https://github.com/valgaze/df-cheat-docs/blob/master/icecream/strawberry.jpg?raw=true",
  mint:
    "https://github.com/valgaze/df-cheat-docs/blob/master/icecream/mint.jpg?raw=true",
  broccoli: [
    `https://github.com/valgaze/df-cheat-docs/blob/master/icecream/broccoli_1.jpg?raw=true`,
    `https://github.com/valgaze/df-cheat-docs/blob/master/icecream/broccoli_2.JPG?raw=true`,
  ][Math.random() > 0.5 ? 0 : 1],
};
export const _keyword = "_icecream";
type flavors = "chocolate" | "vanilla" | "strawberry" | "mint" | "broccoli";

export const _icecreamCheatMode = (conv, flavor: flavors, num: number) => {
  const icecreamStats = conv.cheat.getData(_keyword);
  if (icecreamStats) {
    icecreamStats[flavor] = num;
    conv.cheat.saveData(_keyword, icecreamStats);
  } else {
    const icecreamStarter = {};
    icecreamStarter[flavor] = num;
    conv.cheat.saveData(_keyword, icecreamStats);
  }
};

export const icecreamCount = (
  conv,
  icecreamHash,
  flavor: string,
  keyword = "_icecream"
) => {
  let count = 0;
  let totalCount = 0;
  const icecreamStats = conv.cheat.getData(keyword);
  if (icecreamStats) {
    icecreamStats[flavor] = icecreamStats[flavor] + 1;
    count = icecreamStats[flavor];
    conv.cheat.saveData(keyword, icecreamStats);
  } else {
    const icecreamStarter = {};
    for (let item in icecreamHash) {
      if (item === flavor) {
        icecreamStarter[item] = 1;
        count = 1;
      } else {
        icecreamStarter[item] = 0;
      }
    }
    conv.cheat.saveData(keyword, icecreamStarter);
    count = 1;
  }

  interface Datum {
    data: any;
  }
  interface valuesLabels {
    labels: string[];
    datasets: Datum[];
  }
  const valuesLabels: valuesLabels = { labels: [], datasets: [] };
  const payload: number | string[] = [];
  for (let flavor in icecreamStats) {
    const orderCount = icecreamStats[flavor];
    totalCount += orderCount;
    valuesLabels.labels.push(flavor);
    payload.push(orderCount);
  }
  valuesLabels.datasets.push({ data: payload });
  return { count, totalCount, valuesLabels };
};
