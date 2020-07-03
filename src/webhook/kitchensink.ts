// type for conv object
import { DFCheatConversation } from "df-cheatcodes";

export default function (conv: DFCheatConversation, parameters) {
  conv.add("Heres a card..."); // Need a simple response
  conv.cheat.card({
    text: `Here is your 🍦!!! This type of mint ice cream is great  \nEverybody after this line break loves it.`,
    subtitle: "Here's your subtitle",
    title: `Here's your large mint`,
    buttons: [
      {
        title: `Learn more about mint ice cream`,
        url: `http://kitchenability.com/kitchenability/mint-chocolate-chip-ice-cream`,
      },
    ],
    image: {
      url: "https://i.imgur.com/W9Eeuu1.jpg",
      alt: "Mint!",
    },
  });
}
