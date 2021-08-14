interface Response {
  data: {
    id: number;
    symbol: string;
    name: string;
    amount: number;
    quote: {
      GBP: {
        price: number;
        last_updated: Date;
      };
    };
  };
}

interface Result {
  title: string;
  subtitle: string;
  arg?: string;
  text?: {
    copy: string;
    largetype: string;
  };
  mods?: {
    cmd: {
      arg: string;
      subtitle: string;
    };
  };
}

const MISSING_ARGUMENT_MESSAGE = Object.freeze({
  title: `Incorrect argument`,
  subtitle: `Example: cpc 0.02 BTC GBP`,
});

const ERROR_MESSAGE = Object.freeze({
  title: `Incorrect request`,
  subtitle: `Are you sure thi coin exists? How about your API key?`,
});

const printResult = (result: Result) =>
  console.log(
    JSON.stringify({
      items: [result],
    })
  );

const [apiKey, coinOutputDefault, value, coinSource = "", coinOutput] =
  Deno.args[0].split(" ");

const coinSourceUpperCase = coinSource.toUpperCase();
const coinTargetUpperCase = (
  coinOutput ? coinOutput : coinOutputDefault
).toUpperCase();

try {
  if (!Number(value) || coinSourceUpperCase === "") {
    printResult(MISSING_ARGUMENT_MESSAGE);
  } else {
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

    printResult({
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
  }
} catch {
  printResult(ERROR_MESSAGE);
}
