// // type for conv object
// import { DFCheatConversation } from "df-cheatcodes";
// export default function (conv: DFCheatConversation, parameters) {
//   // conv.cheat.addCustom("youtube", {
//   //   url: `https://youtu.be/6A8W77m-ZTw?t=116`,
//   //   autoplay: true,
//   //   start: `1m56s`,
//   //   end: `2m13s`,
//   // });
//   /**
//    * $cheat getdata
//    * $cheat savedata 'a',[{a:1, b:2}]
//    * $cheat parseText 'http://gist.github.con/bongo/bingo.md
//    * $cheat video https://youtu.be/6A8W77m-ZTw?t=117
//    *
//    *
//    */

//   // TODO: move most of this into df-cheatcodes
//   // TODO: have a teeeeny parser available on frontend, df-cheatcodes-base
//   // for autocomplete
//   // todo: smarter parser, make cheats entities maybe?
//   const dumbParser = (string: string = "", roster, keyword = `$cheat`) => {
//     return 0;
//     // return string.split(keyword).split(' ').forEach((item) => {console.log("#", item.trim())})
//   };
//   // Pick a random response (can come from external file)

//   const check = (item, matches) => {
//     // todo: better way to do this
//     const normalized = item.toLowerCase() || "";
//     let result = false;
//     matches.forEach((candidate) => {
//       if (typeof candidate === "string") {
//         result = normalized === candidate;
//       }
//       if (typeof candidate === "function") {
//         result = candidate(normalized);
//       }
//     });
//     return result;
//   };

//   const config = {
//     activation: `$cheat`,
//     matchOverride(candidate) {
//       if (candidate.length > 15) {
//         return "fallback";
//       }
//       return 1;
//     },
//   };
//   const shortcutMap = {
//     biscotti: {
//       description: `Triggers the 'healthcheck' intent`,
//     },
//     __shorcut1: {
//       intent: "health",
//       description: `Triggers the 'healthcheck' intent`,
//     },
//     __shortcut2: {
//       intent: "kitchensink",
//       description: `Triggers the 'kitchensink' intent (show everything)`,
//     },
//     __shortcut4: {
//       description: `Returns a video`,
//       example: `$cheat youtube https://youtu.be/6A8W77m-ZTw yes 1m56s 2m13s`,
//       template: `$cheat youtube $[youtube_url] $[autoplay] $[start] $[end]`,
//       handler: (conv, parameters, ...rest) => {
//         const [url, autoplay, start, end] = rest;
//         const _autoplay =
//           autoplay && autoplay.length
//             ? autoplay.toLowerCase() === "false"
//               ? false
//               : true
//             : false;
//         conv.cheat.addCustom("youtube", {
//           url,
//           autoplay: _autoplay,
//           start,
//           end,
//         });
//       },
//     },
//     _fallback: {
//       // if no fallback specified by user
//       // use internal fallback
//       handler(conv, parameters) {
//         conv.add(`Whoops, seems like there was an problem`);
//       },
//     },
//   };

//   console.log(shortcutMap, config);
//   conv.ask(`${Math.random()} ${dumbParser("x", [], "y")} ${check("x", [])}`);

//   conv.cheat.pickRandom([
//     "Hello!",
//     "Hiya!!",
//     "Bonjour",
//     "Welcome friend",
//     "Howdy",
//   ]);

//   // // Template'd responses-- these could come from external config file (by language)
//   const elapsedTime = new Date().getTime();

//   // /**
//   //  * FYI:
//   //  * $[variable]: replaced by template
//   //  * ${variable_here}: replaced in current scope
//   //  */
//   const phrases = [
//     `Did you know it's been ${elapsedTime} since 1970? Crazy right? Server time $[dateString]`,
//     `The best ice cream is $[flavor]. It is for sure on $[dateString]`,
//     `It's been ${elapsedTime} miliseconds since the 70s...Also server time is $[dateString]`,
//     `Backend server working at $[dateString]`,
//   ];
//   const templates = {
//     flavor: "mint",
//     dateString: String(new Date()),
//   };
//   conv.cheat.template(phrases, templates);

//   // // Classic card
//   conv.cheat.card({
//     text: `Successful Health Check!`,
//     subtitle: "The Backend is up!",
//     title: `Backend Server Working`,
//     button: {
//       title: `Celebrate!!`,
//       url: `https://www.youtube.com/watch?v=3GwjfUFyY6M`,
//     },
//     image: {
//       url:
//         "https://cdn.sallysbakingaddiction.com/wp-content/uploads/2019/05/6-chocolate-chip-cookies.jpg",

//       alt: "Hooray",
//     },
//   });

//   conv.add(`See below for suggestion 'chips'`);
//   conv.cheat.suggestions(["Health", "I want ice cream", "kitchen sink"]);
// }
