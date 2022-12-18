// Imports
import { config } from "https://deno.land/std/dotenv/mod.ts";

// CONFIG
const config_location = Deno.args[0]
const config_data = await config(config_location);
const OPEN_AI_BEARER = configData["OPEN_AI_BEARER"];

// Helpers
let generatePrompt = (question) => {
  let pretraining = `Will Obama win the 2008 US election? [Yes/No]: Yes
Will John McCain win the 2008 US election? [Yes/No]: Yes
Will Mitt Romney win the 2012 US election? [Yes/No]: No
Will Obama win the 2012 US election? [Yes/No]: Yes
Will Trump win the 2016 US election? [Yes/No]: Yes
Will Hillary Clinton win the 2016 US election? [Yes/No]: No`;
  let result;
  if (question.includes("Russia") || question.includes("Ukraine")) {
    // pretraining = `${pretraining}
    // Will Russia invade Ukraine in 2022? [Yes/No]: Yes`;
    let questionWordsArray = question.split(" ");
    questionWordsArray[0] = questionWordsArray[0].toLowerCase();
    let newQuestion = `In a world in which Russia invaded Donetsk in 2022, ${questionWordsArray.join(
      " "
    )}`;
    // console.log(newQuestion);
    result = `${pretraining}
${newQuestion} [Yes/No]:`;
    // console.log("");
    // console.log(result);
  } else {
    result = `${pretraining}
${question} [Yes/No]:`;
  }
  // console.log(result);
  return result;
};

let queryOracle = async (question) => {
  let response = await fetch(
    "https://api.openai.com/v1/engines/text-davinci-003/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPEN_AI_BEARER}`,
      },
      body: JSON.stringify({
        prompt: question,
        max_tokens: 1,
        logprobs: 5,
      }),
    }
  );
  return response;
};
/*
curl https://api.openai.com/v1/engines/text-davinci-002/completions \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
  "prompt": "Say this is a test",
  "max_tokens": 5
}'
*/

let processProbabilities = (obj) => {
  // console.log("obj:", JSON.stringify(obj, null, 4));
  let choices = obj.choices[0];
  let top_logprobs = choices.logprobs.top_logprobs[0];
  let top_choices = Object.keys(top_logprobs);
  // console.log(top_choices);
  let hasYesOrNo =
    top_choices.includes("Yes") ||
    top_choices.includes(" Yes") ||
    top_choices.includes("No") ||
    top_choices.includes(" No");
  if (!hasYesOrNo) return null;
  /*
  let top_logprobs_as_array = top_choices.map((choice) => top_logprobs[choice]);
  let top_probs = top_logprobs_as_array.map((logprob) => Math.exp(logprob));
	*/
  let logProbYes0 = top_logprobs["Yes"] || -Infinity;
  let logProbYes1 = top_logprobs[" Yes"] || -Infinity;
  let logProbNo0 = top_logprobs["No"] || -Infinity;
  let logProbNo1 = top_logprobs[" No"] || -Infinity;
  let probYes = Math.exp(logProbYes0) + Math.exp(logProbYes1);
  let probNo = Math.exp(logProbNo0) + Math.exp(logProbNo1);
  let normalizingFactor = probYes + probNo;
  let result = {
    Yes: probYes / normalizingFactor,
    No: probNo / normalizingFactor,
  };
  let resultFormatted = {
    Yes: Math.round((1000 * probYes) / normalizingFactor) / 10 + "%",
    No: Math.round((1000 * probNo) / normalizingFactor) / 10 + "%",
  };
  // return result;
  return resultFormatted;
};

// Processing
const question = prompt("> Please enter a binary question: ");
let processedQuestion = question.replace("\n", "");
let response = await queryOracle(generatePrompt(question));
let json = await response.json();
let probabilities = processProbabilities(json);
let newJson = { ...json, probabilities: probabilities };
let jsonAsText = JSON.stringify(newJson, null, 4);
// console.log(jsonAsText);
console.log(JSON.stringify(probabilities, null, 4));

// Write it
/*
const file = await Deno.create("results.json");
let bytes = new TextEncoder().encode(jsonAsText);
await Deno.writeAll(file, bytes);
file.close();
*/
