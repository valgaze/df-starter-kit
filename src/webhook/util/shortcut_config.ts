import { DFCheatConversation } from "df-cheatcodes";
import { _icecreamCheatMode } from "./icecream_helper";
/**
 * This is cheatMap. You can add various shortcuts
 * ex. $cheat video url=https://youtu.be/6A8W77m-ZTw autoplay=true start=1m56 end=2m13s
 * ex. $cheat help
 * ex  $cheat biscotti
 * ex  $cheat graph
 * If you want multiple variations to "match" to a cheat, see the commandOverride option
 */
const shortcutMap = {
  biscotti: {
    description: `Biscotti vs biscutto`,
    examples: [`$cheat biscotti`, `$cheat biscotto`],
    handler: (conv: DFCheatConversation, parameters, args) => {
      conv.add(`Biscotti vs biscotto`); // You must have one simple response w/ anything fancy (dialogflow enforced)
      conv.cheat.addCustom("youtube", {
        text: "Biscotti vs biscotto",
        url: `https://youtu.be/6A8W77m-ZTw`,
        autoplay: true,
        start: `1m43s`,
        end: `2m13s`,
      });
    },
  },
  hackicecream: {
    description: `Adjust icecream numbers`,
    examples: [
      `$cheat hackicecream flavor=vanilla count=18`,
      `$cheat hackicecream flavor=chocolate count=3`,
      `$cheat hackicecream flavor=broccoli count=3`,
    ],
    handler: (conv: DFCheatConversation, parameters, args) => {
      conv.add(`Cheat ice cream system...`);
      const { flavor, count } = args;
      if (flavor === undefined || count === undefined) {
        const sorrys = [
          `Sorry pal, you need to add a 'count' & 'flavor' field for that to work`,
          `That cheat requires both 'count' & 'flavor' on that video`,
          `ERROR: You want something like this: $cheat hackicecream flavor=mint count=44`,
        ];
        conv.cheat.pickRandom(sorrys);
      } else {
        _icecreamCheatMode(conv, flavor, count);
      }
    },
  },
  video: {
    description: `Returns a video`,
    examples: [
      `$cheat video url=https://www.youtube.com/watch?v=YKIjXoiubzc autoplay=yes`,
      `$cheat video url=https://youtu.be/6A8W77m-ZTw autoplay=yes start=2m15s end=3m4s`,
    ],
    template: `$cheat video url=[youtube_url] autoplay=[yes/no] start=[timestamp] end=[timestamp]`,
    handler: (conv, parameters, args) => {
      if (!args.url) {
        const sorrys = [
          `Sorry pal, you need to add a 'url' field for that to work`,
          `You're missing a 'url' on that video`,
        ];
        conv.cheat.pickRandom(sorrys);
        conv.add(
          `ex. $cheat video url=https://youtu.be/6A8W77m-ZTw autoplay=yes start=2m15s end=3m4s`
        );
        return conv.add(`$cheat help for more information`);
      }
      conv.add(`Here's your video...`);
      const { url, autoplay, start, end } = args;
      const _autoplay =
        autoplay && autoplay.length
          ? autoplay.toLowerCase() === "false" ||
            autoplay.toLowerCase() === "no" ||
            autoplay.toLowerCase() === "0"
            ? false
            : true
          : false;
      conv.cheat.addCustom("youtube", {
        url,
        autoplay: _autoplay,
        start,
        end,
      });
    },
  },

  graph: {
    description: `Produces a graph of visual data`,
    examples: [`$cheat graph`],
    handler: (conv: DFCheatConversation, parameters, args) => {
      const [type, data] = args;

      const buildGraph = (type) => {
        if (type === "linechart") {
          conv.add(`Here's a line graph`); // You must have one simple response w/ anything fancy (dialogflow enforced)
          conv.cheat.addCustom("linechart", {
            title: "Line chart",
            chartdata: {
              title: "Conversational Interface Usage/Engagement Numbers",
              xLabel: "Month",
              yLabel: "Activations per Day",
              data: {
                labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                datasets: [
                  {
                    label: "Expectation",
                    data: [30, 70, 200, 300, 500, 800, 1500, 2900, 5000, 8000],
                  },
                  {
                    label: "Reality",
                    data: [0, 1, 30, 70, 80, 100, 50, 80, 40, 150],
                  },
                ],
              },
              options: { yTickCount: 3 },
            },
          });
        }

        if (type === "barchart") {
          conv.add(`Here's a bar graph`); // You must have one simple response w/ anything fancy (dialogflow enforced)
          conv.cheat.addCustom("barchart", {
            title: "Bar chart",
            chartdata: {
              title: "nth-Dimensional Hyperbrain Analysis",
              data: {
                labels: ["100% of 100%", "50% of 100%"],
                datasets: [{ data: [100, 50] }],
              },
              options: { yTickCount: 2, showLegend: false },
            },
          });
        }

        if (type === "piechart") {
          conv.add(`Here's a pie graph`); // You must have one simple response w/ anything fancy (dialogflow enforced)
          const rand = () => Math.floor(Math.random() * 500);
          conv.cheat.addCustom("piechart", {
            title: "Pie chart",
            chartdata: {
              title: "Data Donut",
              data: {
                labels: ["A", "B", "C"],
                datasets: [{ data: [rand(), rand(), rand()] }],
              },
              options: { innerRadius: 0, showLegend: false },
            },
          });
        }
      };
      if (!type && !data) {
        // $cheat graph
        buildGraph("linechart");
        buildGraph("barchart");
        buildGraph("piechart");
        conv.add(`See others with $cheat help`);
      }

      const roster = [
        `linechart`,
        `barchart`,
        `piechart`,
        `xychart`,
        `radarchart`,
        `stackedbarchar`,
      ];
      const _safeParse = (candidate) => {
        let result = {};
        try {
          result = JSON.parse(candidate);
        } catch (e) {
          console.log("<Catastrophic error parsing this input>", e);
          conv.add(`Sorry, it looks like the data was malformed`);
          return conv.add(`Make sure to use valid JSON`);
        }
        return result;
      };

      if (type === "linechart") {
        buildGraph("linechart");
      }
      if (type === "barchart") {
        buildGraph("barchart");
      }
      if (type === "piechart") {
        buildGraph("piechart");
      }
      if (roster.includes(type)) {
        if (data && typeof data === "string") {
          const parsed = _safeParse(data);
          if (Object.keys(parsed)) {
            conv.cheat.addCustom(type, {
              title: "Ice cream breakdown",
              chartdata: data,
            });
          }
        }
      }
    },
  },
  radio: {
    // hidden: true,
    description: "Play a random video",
    examples: [
      `$cheat radio`,
      `$cheat radio song=kosmo`,
      `$cheat radio song=hipster`,
    ],
    handler: (conv, parameters, args) => {
      // From https://github.com/valgaze/npmusic/blob/master/config.json
      const { song } = args;
      const tunes = [
        {
          tag: "tequilla",
          source: "https://www.youtube.com/watch?v=3H6amDbAwlY",
          artist: "The Champs",
          title: "Tequilla",
        },
        {
          tag: "karud",
          source: "https://www.youtube.com/watch?v=Hz3lG2D6o2A",
          artist: "Joakim Karud",
          title: "Love Mode",
        },
        {
          tag: "breathe",
          source: "https://www.youtube.com/watch?v=fo9jAOx6Pdw",
          artist: "Jimmy Buffett & Caroline Jones",
          title: "Breathe In, Breathe Out, Move On ft. Caroline Jones",
        },
        {
          tag: "whiskey",
          source: "https://www.youtube.com/watch?v=L-LuQVKzZMM",
          artist: "The Pogues",
          title: "Whiskey you're the Devil",
        },
        {
          tag: "candy",
          source: "https://www.youtube.com/watch?v=JqowmHgxVJQ",
          artist: "Harry McClintock",
          title: "The Big Rock Candy Mountain",
        },
        {
          tag: "frampton",
          source: "https://www.youtube.com/watch?v=cYGp5shqLZg",
          artist: "Peter Frampton",
          title: "Do you feel like we do",
        },
        {
          tag: "kosmo",
          source: "https://www.youtube.com/watch?v=YKIjXoiubzc",
          artist: "Jonny Kosmo",
          title: "Jessican Triangle",
        },
        {
          tag: "jessica",
          source: "https://www.youtube.com/watch?v=yRDivUb5EeA",
          artist: "Allman Brothers Band",
          title: "Jessica",
        },
        {
          tag: "signe",
          source: "https://www.youtube.com/watch?v=FYNbn1rHGwE",
          artist: "Eric Clapton",
          title: "signe",
        },
        {
          tag: "exciting",
          source: "https://www.youtube.com/watch?v=Og8v3vvYLvY",
          artist: null,
          title: null,
        },
        {
          tag: "hipster",
          source: "https://www.youtube.com/watch?v=0zz85g_7B_g",
          artist: "Bombadil",
          title: "Coughing on the F Train",
        },
        {
          tag: "arkansas",
          source: "https://www.youtube.com/watch?v=y4bqwmqbli8",
          artist: "Jimmy Dorsey",
          title: "Arkansas Traveler (instrumental)",
        },
        {
          tag: "nyan",
          source: "https://www.youtube.com/watch?v=a_4G3HjGNbw",
          artist: "Lucas Heil",
          title: "Nyan Cat-- Smooth Jazz Cover",
        },
        {
          tag: "truegrit",
          source: "https://www.youtube.com/watch?v=UuAZ4WhbI8o",
          artist: "Elmer Bernstein",
          title: "True Grit",
        },
        {
          tag: "moonhooch",
          source: "https://www.youtube.com/watch?v=5I14TK0ylDo",
          artist: "Moon Hooch",
          title: "NPR Music Tiny Desk Concert",
        },
        {
          tag: "ofersure",
          source: "https://www.youtube.com/watch?v=oMNrMBL1VYg",
          artist: "the Ofersures",
          title: "Folk Song for Dogs",
        },
        {
          tag: "type",
          source: "https://www.youtube.com/watch?v=IyVPyKrx0Xo",
          artist: "Saint Motel",
          title: "My Type",
        },
        {
          tag: "spaces",
          source: "https://www.youtube.com/watch?v=skZPzx-XlD0",
          artist: "Donald Bryd",
          title: "Places and Spaces",
        },
        {
          tag: "peaches",
          source: "https://www.youtube.com/watch?v=wvAnQqVJ3XQ",
          artist: "The Presidents of the United States of America",
          title: "Peaches",
        },
        {
          tag: "common",
          source: "https://www.youtube.com/watch?v=9rjd2S6D4dU",
          artist: "Common",
          title: "be",
        },
        {
          tag: "lawyers",
          source: "https://www.youtube.com/watch?v=lP5Xv7QqXiM",
          artist: "Warren Zevon",
          title: "Laywers, Guns, & Money",
        },
        {
          tag: "mahna",
          source: "https://www.youtube.com/watch?v=agj1WpGLxoo",
          artist: "Cake",
          title: "Mahna Mahna",
        },
        {
          tag: "thinking",
          source: "https://www.youtube.com/watch?v=HuABhumm6fY",
          artist: "Jeopardy",
          title: "Theme Music",
        },
      ];
      const _isEmpty = (x) => Object.keys(x).length === 0;

      let choice = tunes.find((s) => s.tag === song) || {};
      const opts = tunes.map((s) => s.tag);
      if (song === undefined || _isEmpty(choice) || song === "shuffle") {
        choice = conv.cheat.pickRandom(tunes, true);
        conv.add(
          `Picking random fallback song ($cheat rando song=song_name_here)`
        );
        conv.add(`Options: ${opts.join(", ")}`);
      } else {
        conv.add(`For '${song}'...`); // You must have one simple response w/ anything fancy (dialogflow enforced)
      }

      //@ts-ignore
      const { source, artist, title } = choice;
      conv.cheat.addCustom("youtube", {
        text: `${title} -- ${artist}`,
        url: source,
        autoplay: true,
      });
    },
  },
};

/**
 * Config for Shortcut Cheats
 * You can specify a keyword (ex $cheat)
 * but you'll need to train your own intent to
 * match the keyword
 *
 *
 * These take the "conversation" out of conversational
 * interfaces
 *
 * commandOverride:
 *
 *
 */
export const shortcutConfig = {
  keyword: `$cheat`, //
  map: shortcutMap,
  commandOverride(candidate) {
    if (candidate === "biscotto") {
      return "biscotti";
    }
    // Obviously would be nice to do ML parsing
    const variants = ["biscuit", "italy", "conan", "schlansky"];
    if (variants.includes(candidate)) {
      return "biscotti";
    }

    if (candidate.toLowerCase() === "graphs") {
      return "graph";
    }

    return candidate;
    // if result is undefined on map will go to fallback
    // Choose one fallback message, otherwise
  },
};
