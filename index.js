// "use strict";
// const fetch = require("node-fetch");

// fetch(`https://api.npms.io/v2/search?q=${process.argv[2]}`)
//   .then(response => response.json())
//   .then(data => {
//     const results = {
//       items: []
//     };

//     data.results.map(item => {
// results.items.push({
//   title: `${item.package.name}`,
//   subtitle: `${item.package.description} (version ${
//     item.package.version
//   })`,
//   arg: `https://www.npmjs.com/package/${item.package.name}`,
//   mods: {
//     cmd: {
//       valid: item.package.links.repository ? true : false,
//       arg: item.package.links.repository,
//       subtitle: item.package.links.repository
//         ? "Open repository on Github"
//         : "Missing repository link"
//     },
//     alt: {
//       valid: item.package.links.bugs ? true : false,
//       arg: item.package.links.bugs,
//       subtitle: item.package.links.bugs
//         ? "Open Issues"
//         : "Missing bug links"
//     }
//   },
//   text: {
//     copy: `https://www.npmjs.com/package/${item.package.name}`,
//     largetype: `https://www.npmjs.com/package/${item.package.name}`
//   }
// });
//     });
//     // eslint-disable-next-line no-console
//     console.log(JSON.stringify(results));
//   })
//   .catch(error => {
//     // eslint-disable-next-line no-console
//     console.log(
//       JSON.stringify({
//         items: [
//           {
//             title: error.name,
//             subtitle: error.message,
//             valid: false,
//             text: {
//               copy: error.stack
//             }
//           }
//         ]
//       })
//     );
//   });

const fetch = require("node-fetch");

async function main() {
  const results = {
    items: [],
  };

  const [
    value,
    coinSource = "",
    coinTarget = "gbp",
  ] = process.argv[2].trim().split(" ");

  const coinSourceUpperCase = coinSource.toUpperCase();
  const coinTargetUpperCase = coinTarget.toUpperCase();

  if (!Number(value) || coinSourceUpperCase === "") {
    results.items.push({
      title: `Incorect request`,
      subtitle: `Example: cpc 0.02 BTC GBP`,
    });

    console.log(JSON.stringify(results));

    return;
  }

  try {
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=${value}&symbol=${coinSource}&convert=${coinTarget}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": "d95bbadf-1e32-4df6-8078-1b42d1d0fc68",
        },
      }
    );
    const { data } = await response.json();
    const result = data.quote[coinTargetUpperCase].price;

    results.items.push({
      title: result,
      subtitle: `${value}${coinSourceUpperCase} = ${result}${coinTargetUpperCase}`,
      arg: result,
      text: {
        copy: result,
        largetype: `${value}${coinSourceUpperCase} = ${result}${coinTargetUpperCase}`,
      },
    });
  } catch (error) {
    console.error(error);
    results.items.push({
      title: `Incorect request`,
      subtitle: `Example: cpc 0.02 BTC GBP`,
    });
  }

  console.log(JSON.stringify(results));
}

main();
