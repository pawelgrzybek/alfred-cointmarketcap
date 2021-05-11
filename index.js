const fetch = require("node-fetch");

const MISSING_ARGUMENT_MESSAGE = Object.freeze({
  title: `Incorrect argument`,
  subtitle: `Example: cpc 0.02 BTC GBP`,
});

const ERROR_MESSAGE = Object.freeze({
  title: `Incorrect request`,
  subtitle: `Are you sure thi coin exists? How about your API key?`,
});

async function main() {
  const results = {
    items: [],
  };

  const [apiKey, coinOutputDefault, value, coinSource = "", coinOutput] =
    process.argv[2].trim().split(" ");

  const coinSourceUpperCase = coinSource.toUpperCase();
  const coinTargetUpperCase = (
    coinOutput ? coinOutput : coinOutputDefault
  ).toUpperCase();

  if (!Number(value) || coinSourceUpperCase === "") {
    results.items.push(MISSING_ARGUMENT_MESSAGE);
    console.log(JSON.stringify(results));
    return;
  }

  try {
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=${value}&symbol=${coinSourceUpperCase}&convert=${coinTargetUpperCase}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
        },
      }
    );
    const {
      data: { quote, name },
    } = await response.json();
    const result = quote[coinTargetUpperCase].price;
    const coinSourceName = name;
    const coinSourceNameUrl = coinSourceName.toLowerCase().replace(/ /g, "-");

    results.items.push({
      title: result,
      subtitle: `${value} ${coinSourceUpperCase} = ${result} ${coinTargetUpperCase}`,
      arg: result,
      text: {
        copy: result,
        largetype: `${value} ${coinSourceUpperCase} = ${result} ${coinTargetUpperCase}`,
      },
      mods: {
        cmd: {
          arg: `https://coinmarketcap.com/currencies/${coinSourceNameUrl}/`,
          subtitle: `Open ${coinSourceName} on CoinMarketCap`,
        },
      },
    });
  } catch (error) {
    results.items.push(ERROR_MESSAGE);
  } finally {
    console.log(JSON.stringify(results));
  }
}

main();
