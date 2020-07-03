// type for conv object
import { DFCheatConversation } from "df-cheatcodes";

export default function (conv: DFCheatConversation, parameters) {
  // Pick a random response (can come from external file)
  conv.cheat.pickRandom([
    "Hello!",
    "Hiya!!",
    "Bonjour",
    "Welcome friend",
    "Howdy",
  ]);

  // Template'd responses-- these could come from external config file (by language)
  const elapsedTime = new Date().getTime();

  /**
   * FYI:
   * $[variable]: replaced by template
   * ${variable_here}: replaced in current scope
   */
  const phrases = [
    `Did you know it's been ${elapsedTime} since 1970? Crazy right? Anyway, a great ice cream flavor is '$[flavor]'`,
    `The best ice cream is $[flavor]. It is for sure on $[dateString]`,
    `It's been ${elapsedTime} miliseconds since the 70s...Also server time is $[dateString]`,
    `Backend server working at $[dateString]`,
  ];
  const templates = {
    flavor: "mint",
    dateString: String(new Date()),
  };
  conv.cheat.template(phrases, templates);

  // Classic card
  conv.cheat.card({
    text: `Successful Health Check!`,
    subtitle: "The Backend is up!",
    title: `Backend Server Working`,
    button: {
      title: `Celebrate!!`,
      url: `https://www.youtube.com/watch?v=3GwjfUFyY6M`,
    },
    image: {
      url:
        "https://cdn.sallysbakingaddiction.com/wp-content/uploads/2019/05/6-chocolate-chip-cookies.jpg",

      alt: "Hooray",
    },
  });

  /**
   * Note: This is not a browseCarousel
   *
   */
  conv.add(`Here's a carousel`);
  conv.cheat.carousel({
    items: {
      key1: {
        title: "Chocolate",
        description: "Chocolate ice cream",
        synonyms: ["synonym of KEY_ONE 1", "synonym of KEY_ONE 2"],
        image: {
          url:
            "https://github.com/valgaze/df-cheat-docs/blob/master/icecream/chocolate.jpg?raw=true",
          alt: "chocolate ice cream",
        },
      },
      key2: {
        title: "Vanilla",
        description: "Vanilla ice cream",
        synonyms: ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"],
        image: {
          url:
            "https://github.com/valgaze/df-cheat-docs/blob/master/icecream/vanilla.jpg?raw=true",
          alt: "mint ice cream",
        },
      },
      key3: {
        title: "Strawberry",
        description: "Strawberry ice cream",
        synonyms: ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"],
        image: {
          url:
            "https://github.com/valgaze/df-cheat-docs/blob/master/icecream/strawberry.jpg?raw=true",
          alt: "vanilla ice cream",
        },
      },
      key4: {
        title: "Mint",
        description: "Mint ice cream",
        synonyms: ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"],
        image: {
          url:
            "https://github.com/valgaze/df-cheat-docs/blob/master/icecream/mint.jpg?raw=true",
          alt: "Mint ice cream",
        },
      },
      key5: {
        title: "Broccoli",
        description: "Broccoli ice cream",
        synonyms: ["synonym of KEY_TWO 1", "synonym of KEY_TWO 2"],
        image: {
          url:
            "https://github.com/valgaze/df-cheat-docs/blob/master/icecream/mint.jpg?raw=true",
          alt: "Broccoli ice cream",
        },
      },
    },
  });

  conv.add(`You wanted a table?? Here's your table`);
  conv.cheat.table({
    dividers: true,
    columns: ["Col1", "Col2", "Col3"],
    rows: [
      [
        "row 1 item 1",
        "row 1 item 2",
        "**[row 1](https://en.wikipedia.org/wiki/Table_(information))** item 3 (**supports lite markdown**)",
      ],
      ["row 2 item 1", "row 2 item 2", "row 2 item 3"],
    ],
  });

  conv.cheat.media({
    name: "Jazz in Paris",
    url: "http://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3",
    description: "A funky Jazz tune",
    icon: {
      url: "http://storage.googleapis.com/automotive-media/album_art.jpg",
      alt: "Media icon",
    },
  });

  conv.add(`See below for suggestion 'chips'`);
  conv.cheat.suggestions(["Health", "I want ice cream"]);
}
