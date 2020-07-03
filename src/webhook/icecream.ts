import { DFCheatConversation } from "df-cheatcodes";
import {
  icecreamCount,
  icecreamHash,
  responsesTemplates,
  congratsTemplates,
} from "./util/icecream_helper";

export default function (conv: DFCheatConversation, parameters) {
  const { "icecream-flavor": flavor, "icecream-size": size } = parameters; // "flavor", "size" now available
  const imageURL = icecreamHash[flavor];

  conv.cheat.card({
    text: `Here is your 🍦!!! This type of ${flavor} ice cream is great  \nEverybody after this line break loves it.`,
    subtitle: `${flavor} Ice Cream`,
    title: `${size} ${flavor}`,
    button: {
      title: `Learn more about ${flavor}`,
      url: `https://www.google.com/search?q=${flavor}+ice+cream`,
    },
    image: {
      url: imageURL,
      alt: `${flavor} mmm...`,
    },
  });

  // 🍦 Ice Cream Statistics...
  const { count, totalCount, valuesLabels } = icecreamCount(
    conv,
    icecreamHash,
    flavor && flavor.length ? flavor[0] : flavor
  );
  conv.cheat.template(responsesTemplates, { flavor, count });
  if (totalCount && totalCount % 3 === 0) {
    // randomize
    conv.cheat.pickRandom(congratsTemplates);
    conv.cheat.addCustom("barchart", {
      title: "Ice cream breakdown",
      chartdata: {
        data: valuesLabels,
        options: {
          yTickCount: 1,
          dataColors: ["#9b59b6", "#ecf0f1", "#e74c3c", "#A4F0D8", "#00CC33"],
        },
      },
    });
    conv.cheat.suggestions(["I want another ice cream!"]);
  }
}

/**
 * Other chart options
 */
//   conv.cheat.addCustom("piechart", {
//     title: "Ice cream breakdown",
//     chartdata: {
//       title: "Icecream counts",
//       data: {
//         labels: ["chocolate", "vanilla", "strawberry", "mint", "broccoli"],
//         datasets: [{ data: [500, 200, 80, 90, 100] }],
//       },
//       options: { innerRadius: 0.5, legendPosition: 2 },
//     },
//   });
// }

// conv.cheat.addCustom("linechart", {
//   title: "Ice cream breakdown",
//   chartdata: {
//     title: "Ice cream breakdown",
//     xLabel: "Icecream Trips",
//     yLabel: "$ Dollors",
//     data: {
//       labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
//       datasets: [
//         {
//           label: "Plan",
//           data: [30, 70, 200, 300, 500, 800, 1500, 2900, 5000, 8000],
//         },
//         { label: "Reality", data: [0, 1, 30, 70, 80, 100, 50, 80, 40, 150] },
//       ],
//     },
//     options: { yTickCount: 3, legendPosition: 1 },
//   },
// });
